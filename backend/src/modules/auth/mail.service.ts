export class MailService {
    /**
     * Simüle edilmiş e-posta gönderimi.
     * Gerçekten e-posta göndermek yerine terminale log basar.
     */
    public static async sendMail(to: string, subject: string, body: string) {
        console.log("------------------------------------------");
        console.log(`📧 E-POSTA GÖNDERİLDİ: ${to}`);
        console.log(`📌 KONU: ${subject}`);
        console.log(`📝 İÇERİK: ${body}`);
        console.log("------------------------------------------");
        return true;
    }

    public static async sendVerificationEmail(to: string, token: string) {
        const link = `http://localhost:3000/auth/verify?token=${token}`;
        await this.sendMail(to, "Hesap Doğrulama", `Lütfen hesabınızı doğrulamak için tıklayın: ${link}`);
    }

    public static async sendResetPasswordEmail(to: string, token: string) {
        const link = `http://localhost:3000/auth/reset-password?token=${token}`;
        await this.sendMail(to, "Şifre Sıfırlama", `Şifrenizi sıfırlama için tıklayın: ${link}`);
    }
}
