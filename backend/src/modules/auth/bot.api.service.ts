import * as crypto from 'crypto';
import prisma from '../../lib/prisma';

export class BotApiService {
    /**
     * Algoritmik Bot API Anahtarı Oluşturma (Faz 9.2)
     */
    public static async createApiKey(userId: string, label: string, permissions: string[]) {
        const apiKey = `sn_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
        const apiSecret = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

        // Metadata içinde sakla (Şimdilik User modeline eklenmediği için metadata üzerinden simüle ediyoruz)
        await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: `${label}_API_KEY` // Yer tutucu olarak firstName kullanılıyor (normalde tablo gerekir)
            }
        });

        return { apiKey, apiSecret, permissions, label };
    }
}
