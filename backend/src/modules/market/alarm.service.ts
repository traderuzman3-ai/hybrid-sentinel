import prisma from '../../lib/prisma';

export class AlarmService {

    // Create a new alarm
    static async createAlarm(userId: string, symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') {
        return await prisma.alarms.create({
            data: {
                userId,
                symbol,
                targetPrice,
                condition,
                isActive: true,
                isTriggered: false
            }
        });
    }

    // Get user's active alarms
    static async getUserAlarms(userId: string) {
        return await prisma.alarms.findMany({
            where: { userId, isActive: true, isTriggered: false },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Check all alarms for a symbol
    // This should be called by SentinelService on price update
    static async checkAlarms(symbol: string, currentPrice: number) {
        // Find active alarms for this symbol
        const alarms = await prisma.alarms.findMany({
            where: {
                symbol,
                isActive: true,
                isTriggered: false
            }
        });

        const triggeredAlarms = [];

        for (const alarm of alarms) {
            let triggered = false;

            if (alarm.condition === 'ABOVE' && currentPrice >= alarm.targetPrice) {
                triggered = true;
            } else if (alarm.condition === 'BELOW' && currentPrice <= alarm.targetPrice) {
                triggered = true;
            }

            if (triggered) {
                // Mark as triggered/inactive
                await prisma.alarms.update({
                    where: { id: alarm.id },
                    data: { isTriggered: true, isActive: false }
                });

                triggeredAlarms.push(alarm);
                console.log(`🚨 ALARM TRIGGERED: ${symbol} is ${currentPrice} (${alarm.condition} ${alarm.targetPrice})`);

                // TODO: Send WebSocket Notification or Push Notification here
            }
        }

        return triggeredAlarms;
    }
}
