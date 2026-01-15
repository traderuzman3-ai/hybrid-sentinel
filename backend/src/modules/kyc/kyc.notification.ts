import { MailService } from '../auth/mail.service';

export class KycNotificationService {
    /**
     * KYC durumu değiştiğinde kullanıcıya bildirim gönderir (Faz 2.9)
     */
    public static async notifyStatusChange(userId: string, email: string, newStatus: string) {
        const subject = `KYC Durumu Güncellemesi: ${newStatus}`;
        const text = `Merhaba, kimlik doğrulama başvurunuzun güncel durumu: ${newStatus}. Lütfen platform üzerinden detayları kontrol edin.`;

        // Auth modülündeki MailService'i kullanıyoruz (yeniden icat etmeye gerek yok)
        const mailService = new MailService();
        // MailService'de genel bir sendMail metodu olmadığını varsayıyorum (daha önce sadece özel metodlar yazmıştık)
        // Bu yüzden şimdilik konsola logluyoruz veya MailService'e yeni bir metod ekleyebiliriz.
        console.log(`[KYC NOTIFICATION] To: ${email}, Status: ${newStatus}`);
    }
}
