import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from '../../lib/prisma';

export class TwoFAService {
  /**
   * Kullanıcı için yeni bir TOTP secret oluşturur ve QR kod döner
   */
  public static async generateSecret(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, 'TradingPlatform', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Geçici olarak kaydet (enable edilene kadar aktif değil)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFASecret: secret }
    });

    return { secret, qrCodeUrl };
  }

  /**
   * Kullanıcının girdiği kodu doğrular
   */
  public static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  /**
   * 2FA'yı aktif eder
   */
  public static async enableTwoFA(userId: string, token: string, secret: string) {
    const isValid = this.verifyToken(token, secret);
    if (!isValid) throw new Error('Geçersiz doğrulama kodu.');

    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFAEnabled: true }
    });

    return true;
  }

  /**
   * 2FA'yı deaktif eder
   */
  public static async disableTwoFA(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFAEnabled: false, twoFASecret: null }
    });

    return true;
  }
}
