import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

interface RequestComUsuario extends Request {
    user?: any;
}

const SECRET_KEY = process.env.SECRET_KEY || "caso_env_falhe";

const autenticar = (req: RequestComUsuario, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido." })
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token não fornecido ou expirado." })
    }
};

const verificarAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.cargo == true) {
        return next();
    }
};

const usuariosFormatador = z.object({
    nome: z.string({ message: "Campo obrigatório" }).min(3,"O nome deve ter no mínimo 3 caracteres."),
    email: z.email("Formato de e-mail inválido."),
    cargo: z.boolean({ message: "Campo obrigatório verdadeiro (true) ou falso (false)" }),
    senha: z.string({ message: "Campo obrigatório" }).min(6,"A senha deve conter no mínimo 6 caracteres.")
        .transform(val => {
            return bcrypt.hashSync(val, 10);
        })
    ,

    cpf: z.string().transform(val => val.replace(/\D/g, "")).refine(val => cpf.isValid(val),
    { message: "CPF inválido de acordo com a receita federal."})
});

const convidadosFormatador = z.object({
    nome: z.string().min(3,"O nome deve ter no mínimo 3 caracteres."),
    sobrenome: z.string().min(3,"O sobrenome deve ter no mínimo 3 caracteres."),
    email: z.email("Formato de e-mail inválido."),
    mesa: z.number().int().positive("A mesa deve ser um número positivo."),

    telefone: z.string()
        .refine(val => {
            const numeroTelefone = parsePhoneNumberFromString(val, "BR");
            return numeroTelefone ? numeroTelefone.isValid() : false;
        }, { message: "Número de telefone inválido para o padrão brasileiro."})
        .transform(val => {
            const apenasNumero = val.replace(/\D/g, "");
            
            if (apenasNumero.startsWith("55") && apenasNumero.length > 11) {
                const sem55 = apenasNumero.substring(2)
                return sem55;
            }
            return apenasNumero;
        })
    ,

    cpf: z.string().transform(val => val.replace(/\D/g, "")).refine(val => cpf.isValid(val),
    { message: "CPF inválido de acordo com a receita federal."})
});

app.post('/usuario', async (req, res) => {
    const { nome,  cpf, email, cargo, senha } = req.body;

    try {
        const conflito = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { cpf: cpf }, { email: email }
                ]
            }
        });

        if (conflito) {
            return res.status(409).json({ error: "Email ou CPF já existente em outro usuario." })
        }

        const dadosValidos = usuariosFormatador.parse(req.body);

        const novoUsuario = await prisma.usuario.create({
            data: dadosValidos
        })

        res.status(201).json(novoUsuario);
    } catch (error) {
        return res.status(401).json({ error: "Erro ao criar convidado."})
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
        where: { email: email }
    });

    if (!usuario) {
        return res.status(401).json({ error: "E-mail ou Senha incorretas." })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(409)
    }

    const token = jwt.sign(
        { id: usuario.id, cargo: usuario.cargo },
        SECRET_KEY,
        { expiresIn: '1d'}
    )

    res.status(200  ).json({token});
});

app.post('/convidado/criar', autenticar, verificarAdmin, async (req, res) => {
    const { nome, sobrenome, cpf, email, telefone, mesa } = req.body;

    try {
        const conflito = await prisma.convidado.findFirst({
            where: {
                OR: [
                    { email: email },
                    { telefone: telefone },
                    { cpf: cpf }
                ]
            }
        });

        if (conflito) {
            return res.status(409).json({ error: "Email ou Telefone já existente em outro convidado." })
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
});

app.get('/convidado/todos', autenticar, async (req, res) => {
    try {
        const convidados = await prisma.convidado.findMany();

        res.status(200).json(convidados);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar convidados." })
    }
});

app.patch('/convidado/:id/checkin', autenticar, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const novoCheckin = await prisma.convidado.update({
            where: { id: Number(id)},
            data: { status_checkin: status }
        });

        res.status(200).json(novoCheckin);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar checkin." })
    }
});

app.put('/convidado/:id/atualizar', autenticar, verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, mesa } = req.body;

    try {
        if (!nome || !email || !telefone || !mesa) {
            return res.status(401).json({ error: "Campos obrigatórios." })
        }

        const conflito = await prisma.convidado.findFirst({
            where: {
                AND: [
                    { NOT: {id: Number(id)} },
                    { OR: [ {email: email}, {telefone: telefone} ] }
                ]
            }
        });

        if (conflito) {
            return res.status(401).json({ error: "Email ou Telefone já existente em outro convidado." })
        }

        const convidadoAtualizado = await prisma.convidado.update({
            where: { id: Number(id) },
            data: {
                nome: nome,
                email: email,
                telefone: telefone,
                mesa: Number(mesa)
            }
        });

        res.status(200).json(convidadoAtualizado);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar convidado." });
    }
});

app.delete('/convidado/:id/apagar', autenticar, verificarAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.convidado.delete({
            where: { id: Number(id) }
        });

        res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Erro ao apagar convidado." });
    }
});

app.get('/dashboard', autenticar, verificarAdmin, async (req, res) => {
    const total = await prisma.convidado.count();
    const confirmados = await prisma.convidado.count({
        where: { status_checkin: true }
    })

    res.status(200).json({
        total,
        confirmados,
        faltantes: total - confirmados
    })
});

app.listen(3000, () => {
    console.log("SERVIDOR NO AR EM: 3000")
});