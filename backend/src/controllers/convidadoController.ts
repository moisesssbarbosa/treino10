import { Request, Response } from "express";
import { prisma } from '../config/database';
import { convidadosFormatador } from "../schemas/convidadoSchema";
import { z } from 'zod';

export const criarConvidados = async ( req: Request, res: Response) => {
    try {
        const { email, telefone, cpf} = req.body;

        const conflito = await prisma.convidado.findFirst({
            where: {
                OR: [{ email: email }, { telefone: telefone }, { cpf: cpf }]
            }
        });

        if (conflito) {
            return res.status(409).json({ error: "Email, CPF ou Telefone já existente em outro convidado." })
        }

        const dadosValidos = convidadosFormatador.parse(req.body);

        const novoConvidado = await prisma.convidado.create({
            data: dadosValidos
        });

        res.status(201).json(novoConvidado);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Erro de validação nos campos.",
                detalhes: error.issues.map(err => err.message)
            });
        }
        return res.status(500).json({ error: "Erro ao criar convidado." })
    }
};

export const atualizarCheckin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status_checkin } = req.body;

        const resultado = await prisma.convidado.updateMany({
            where: {
                id: Number(id),
                status_checkin: !status_checkin
            },
            data: {
                status_checkin: status_checkin
            }
        });

        if (resultado.count === 0) {
            return res.status(409).json({ 
                error: "Este check-in já foi feito ou o convidado não existe."
            })
        }

        return res.status(200).json({
            message: `Status de check-in atualizado para ${status_checkin}!`,
            status: status_checkin
        })
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar check-in." })
    }
};

export const atualizarConvidados = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, telefone, cpf } = req.body;

        const conflito = await prisma.convidado.findFirst({
            where: {
                AND: [
                    { NOT: {id: Number(id)} },
                    { OR: [{email: email}, {telefone: telefone}, {cpf: cpf}] }
                ]
            }
        });

        if (conflito) {
            return res.status(409).json({ error: "Email, CPF ou Telefone já existente em outro convidado." })
        }

        const dadosValidos = convidadosFormatador.parse(req.body);

        const convidadoAtualizado = await prisma.convidado.update({
            where: { id: Number(id) },
            data: dadosValidos
        });

        res.status(200).json(convidadoAtualizado);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Erro de validação nos campos.",
                detalhes: error.issues.map(err => err.message)
            });
        }
        return res.status(500).json({ error: "Erro ao atualizar convidado." });
    }
};

export const listarConvidados = async (req: Request, res: Response) => {
    try {
        const convidados = await prisma.convidado.findMany();
        res.status(200).json(convidados);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar convidados." })
    }
};

export const apagarConvidados = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const convidadoExiste = await prisma.convidado.findFirst({
            where: { id: Number(id) }
        })

        if (!convidadoExiste) {
            return res.status(404).json({ error: "Convidado não encontrado."})
        }

        await prisma.convidado.delete({
            where: { id: Number(id) }
        });

        res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Erro ao apagar convidado." });
    }
};