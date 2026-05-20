import { prisma } from "../config/database";
import { Request, Response } from "express";
import { usuariosFormatador } from '../schemas/usuarioSchema';
import { z } from 'zod';

export const criarUsuarios = async (req: Request, res: Response) => {
    try {
        const { cpf, email } = req.body;

        const conflito = await prisma.usuario.findFirst({
            where: {
                OR: [{ cpf: cpf }, { email: email }]
            }
        });

        if (conflito) {
            return res.status(409).json({ error: "Email ou CPF já existente em outro usuario." })
        }

        const dadosValidos = usuariosFormatador.parse(req.body);

        const novoUsuario = await prisma.usuario.create({
            data: dadosValidos
        })

        const { senha, ...usuarioRetornado } = novoUsuario;

        res.status(201).json(usuarioRetornado);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Erro de validação nos campos.",
                detalhes: error.issues.map(err => err.message)
            });
        }
        return res.status(500).json({ error: "Erro ao criar usuário."})
    }
};