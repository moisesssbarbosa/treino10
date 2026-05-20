import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface RequestComUsuario extends Request {
    user?: any;
}

export const autenticar = (req: RequestComUsuario, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido." })
    }

    const [, token] = authHeader.split(' ');

    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY) {
        return res.status(500).json({ error: "Erro interno no servidor de autenticação."})
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token não fornecido ou expirado." })
    }
};