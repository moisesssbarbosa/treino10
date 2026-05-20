import { Response, NextFunction } from "express";

export const verificarAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.cargo == true) {
        return next();
    }
    return res.status(403).json({ error: "Acesso negado, apenas administradores."})
};