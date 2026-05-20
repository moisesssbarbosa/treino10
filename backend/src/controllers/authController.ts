import { prisma } from '../config/database';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

export const fazerLogin = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;

        const SECRET_KEY = process.env.SECRET_KEY;

        if (!SECRET_KEY) {
            return res.status(500).json({ error: "Erro interno no servidor de autenticação" });
        }

        if (!email || !senha) {
            return res.status(400).json({ error: "Campos obrigatórios." });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            return res.status(401).json({ error: "E-mail ou Senha incorretas." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou Senha incorretas." });
        }

        const token = jwt.sign(
            { id: usuario.id, cargo: usuario.cargo },
            SECRET_KEY,
            { expiresIn: '1d'}
        )

        res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao fazer login." })
    }
};