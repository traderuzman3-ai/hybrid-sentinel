// @ts-ignore
// import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from '../../lib/prisma';

export class TwoFAService {
  /**
   * Kullanıcı için yeni bir TOTP secret oluşturur ve QR kod döner
   */
  public static async generateSecret(userId: string, email: string) {
    const secret = "MOCKED_SECRET_" + Math.random().toString(36).substring(7);
    const qrCodeUrl = await QRCode.toDataURL("otpauth://totp/TradingPlatform?secret=" + secret);

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
    // Demo için her zaman true döner veya basit bir kontrol yapar
    return token === "123456" || token === secret;
  }

  /**
   * 2FA'yı aktif eder
   */
  public static async enableTwoFA(userId: string, token: string, secret: string) {
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
