import { z } from "zod";
import { UserRole } from "@prisma/client";

export const RegisterSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("E-mail inválido"),
        cpf: z.string().min(11, "CPF inválido"),
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
        role: z.nativeEnum(UserRole),
        specialty: z.string().optional(),
        crm: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.role === UserRole.DOCTOR && (!data.specialty || !data.crm)) {
                return false;
            }
            return true;
        },
        {
            message: "Especialidade e CRM são obrigatórios para médicos",
            path: ["specialty"],
        },
    );

export const LoginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
