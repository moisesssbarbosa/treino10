import { prisma } from '../config/database';
import { Request, Response } from 'express';

export const obterMetricas = async (req: Request, res: Response) => {
    try {
        const total = await prisma.convidado.count();
        const confirmados = await prisma.convidado.count({
            where: { status_checkin: true }
        });

        res.status(200).json({
            total,
            confirmados,
            faltantes: total - confirmados
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar dados do dashboard." })
    }
};