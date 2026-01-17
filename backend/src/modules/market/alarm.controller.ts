import { FastifyRequest, FastifyReply } from 'fastify';
import { AlarmService } from './alarm.service';

export async function createAlarm(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const { symbol, targetPrice, condition } = req.body as any;

    try {
        const alarm = await AlarmService.createAlarm(userId, symbol, parseFloat(targetPrice), condition);
        return { success: true, alarm };
    } catch (error: any) {
        req.log.error(error);
        return reply.status(400).send({ error: 'Alarm oluşturulamadı.' });
    }
}

export async function getUserAlarms(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const alarms = await AlarmService.getUserAlarms(userId);
    return { alarms };
}
