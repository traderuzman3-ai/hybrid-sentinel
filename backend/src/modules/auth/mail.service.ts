import nodemailer from 'nodemailer';

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'traderuzman3@gmail.com', // Kullanıcının Gmail adresi
        pass: 'zwuj gliz kjpn cowt'     // Uygulama şifresi
    }
});

// Frontend URL for verification links
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export class MailService {
    /**
     * Gerçek e-posta gönderimi (Brevo SMTP ile)
     */
    public static async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await transporter.sendMail({
                from: '"Hybrid Sentinel" <traderuzman3@gmail.com>',
                to,
                subject,
                html
            });
            console.log(`📧 E-posta gönderildi: ${to} (ID: ${info.messageId})`);
            return true;
        } catch (error) {
            console.error('❌ E-posta gönderme hatası:', error);
            // Hata olsa bile devam et (kullanıcı kaydı engellenmesin)
            return false;
        }
    }

    public static async sendVerificationEmail(to: string, token: string) {
        const link = `${FRONTEND_URL}/auth/verify-email?token=${token}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a365d;">🔐 Hesabınızı Doğrulayın</h2>
                <p>Merhaba,</p>
                <p>Hybrid Sentinel hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
                <a href="${link}" style="display: inline-block; background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Hesabımı Doğrula
                </a>
                <p style="color: #666; font-size: 14px;">Veya bu linki tarayıcınıza yapıştırın:</p>
                <p style="color: #3182ce; word-break: break-all;">${link}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                <p style="color: #999; font-size: 12px;">Bu e-postayı siz istemediyseniz, lütfen dikkate almayın.</p>
            </div>
        `;
        await this.sendMail(to, 'Hesabınızı Doğrulayın - Hybrid Sentinel', html);
    }

    public static async sendResetPasswordEmail(to: string, token: string) {
        const link = `${FRONTEND_URL}/auth/reset-password?token=${token}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a365d;">🔑 Şifrenizi Sıfırlayın</h2>
                <p>Merhaba,</p>
                <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                <a href="${link}" style="display: inline-block; background: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Şifremi Sıfırla
                </a>
                <p style="color: #666; font-size: 14px;">Bu link 1 saat içinde geçerliliğini yitirecektir.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                <p style="color: #999; font-size: 12px;">Bu e-postayı siz istemediyseniz, lütfen dikkate almayın.</p>
            </div>
        `;
        await this.sendMail(to, 'Şifre Sıfırlama - Hybrid Sentinel', html);
    }
}
