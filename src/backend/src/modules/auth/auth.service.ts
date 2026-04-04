import { PrismaClient } from "@prisma/client";
function badRequest(message: string) {
    throw Object.assign(new Error(message), { status: 400 });
}

export async function registerUser(data: RegisterDTO) {
    const specialty = data.specialty?.trim();
    const crm = data.crm?.trim();

    if (data.role === "DOCTOR") {
        if (!specialty) {
            badRequest("Especialidade é obrigatória para médico.");
        }

        if (!crm) {
            badRequest("CRM é obrigatório para médico.");
        }
    }

    // Criptografa a senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
        // Verifica se e-mail já existe
        const emailExists = await tx.user.findUnique({
            where: { email: data.email },
        });
        if (emailExists) {
            badRequest("E-mail já cadastrado!");
        }

        // Verifica se CPF já existe
        const cpfExists = await tx.user.findUnique({
            where: { cpf: data.cpf },
        });
        if (cpfExists) {
            badRequest("CPF já cadastrado!");
        }

        if (data.role === "DOCTOR") {
            const crmExists = await tx.doctor.findUnique({
                where: { crm: crm! },
            });
            if (crmExists) {
                badRequest("CRM já cadastrado!");
            }
        }

        // Cria o usuário no banco
        const createdUser = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                passwordHash,
                role: data.role,
            },
        });

        // Se for médico, cria o registro na tabela Doctor
        if (data.role === "DOCTOR") {
            await tx.doctor.create({
                data: {
                    userId: createdUser.id,
                    specialty: specialty!,
                    crm: crm!,
                },
            });
        }

        return createdUser;
    });
        // Se for médico, cria o registro na tabela Doctor
        if (data.role === "DOCTOR") {
            await tx.doctor.create({
                data: {
                    userId: createdUser.id,
                    specialty: data.specialty!,
                    crm: data.crm!,
                },
            });
        }

        return createdUser;
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(data: LoginDTO) {
    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("Credenciais inválidas");
    }

    // Compara a senha com o hash salvo no banco
    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error("Credenciais inválidas");
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    return { token, user: { id: user.id, name: user.name, role: user.role } };
}
