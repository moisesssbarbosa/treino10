import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const apenasLetrasRegex = /^[A-Za-zÀ-ÿ ]+$/;

export const convidadosFormatador = z.object({
    nome: z.string()
        .min(3,"O nome deve ter no mínimo 3 caracteres.")
        .refine(val => apenasLetrasRegex.test(val), {
            message: "O nome deve conter apenas letras."
        }),
    sobrenome: z.string().min(3,"O sobrenome deve ter no mínimo 3 caracteres.")
        .refine(val => apenasLetrasRegex.test(val), {
            message: "O sobrenome deve conter apenas letras."
        }),
    email: z.email("Formato de e-mail inválido."),
    mesa: z.number().int().positive("A mesa deve ser um número positivo."),
    telefone: z.string()
        .refine(val => {
            const numeroTelefone = parsePhoneNumberFromString(val, "BR");
            return numeroTelefone ? numeroTelefone.isValid() : false;
        }, { message: "Número de telefone inválido para o padrão brasileiro."})
        .refine(val => !/^(.)\1+$/.test(val.replace(/\D/g, "")), {
            message: "O número de telefone não pode conter todos os dígitos iguais."
        })
        .transform(val => {
            const apenasNumero = val.replace(/\D/g, "");
            
            if (apenasNumero.startsWith("55") && apenasNumero.length > 11) {
                const sem55 = apenasNumero.substring(2)
                return sem55;
            }
            return apenasNumero;
        }),
    cpf: z.string()
    .transform(val => val.replace(/\D/g, ""))
    .refine(val => cpf.isValid(val), { message: "CPF inválido de acordo com a receita federal."})
});