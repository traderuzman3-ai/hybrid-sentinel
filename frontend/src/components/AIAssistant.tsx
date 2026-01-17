'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Terminal } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'USER' | 'AI';
    timestamp: number;
}

export default function AIAssistant() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Merhaba! Ben Jarvis. Piyasa analizini yapabilirim. Neyi merak ediyorsun?', sender: 'AI', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'USER', timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg.text })
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.text || 'Üzgünüm, şu an bağlantı kuramıyorum.',
                sender: 'AI',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Bağlantı hatası.', sender: 'AI', timestamp: Date.now() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        // Optional: auto send? Let's just fill input for now or auto send
        // Let's auto send for better UX
        // Need to wrap handleSend logic to accept arg, simplistic way:
        setTimeout(() => {
            // Check if needed, but better to let user press enter or refactor.
            // For now just set input.
        }, 0);
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-12 right-6 w-14 h-14 bg-primary text-text-primary rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50 border-2 border-primary/50 animate-bounce-slow"
                >
                    <Bot size={28} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-12 right-6 w-[350px] h-[500px] bg-background-paper border border-primary/30 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-primary/10 p-3 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot size={18} className="text-primary" />
                            <span className="font-bold text-sm text-primary">JARVIS AI</span>
                        </div>
                        <div className="flex gap-2 text-text-secondary">
                            <button onClick={() => setIsOpen(false)} className="hover:text-text-primary"><Minimize2 size={16} /></button>
                            <button onClick={() => setIsOpen(false)} className="hover:text-red-500"><X size={16} /></button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'USER'
                                        ? 'bg-primary text-text-primary rounded-tr-none'
                                        : 'bg-white/10 border border-white/5 text-text-primary rounded-tl-none'
                                    }`}>
                                    {msg.sender === 'AI' && <Bot size={12} className="mb-1 text-primary opacity-70" />}
                                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                                    <div className="text-[10px] opacity-40 mt-1 text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 rounded-lg p-3 rounded-tl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length < 3 && (
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            {['Piyasa Durumu', 'BTC Analiz', 'Haberler'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setInput(p)}
                                    className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 border-t border-border bg-background-paper">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Bir soru sor..."
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none placeholder:text-text-secondary"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-primary text-text-primary p-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
