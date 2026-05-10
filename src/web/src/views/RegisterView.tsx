import { useState } from "react";
import type React from "react";

interface RegisterViewProps {
    onRegister: (name: string, email: string, password: string, cpf: string, crm?: string, specialty?: string) => Promise<void>;
    onGoLogin: () => void;
    mode: "patient" | "professional";
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--ink)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
};

const alertStyle = (type: "error" | "success"): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    marginBottom: 16,
    background: type === "success" ? "#E1F5EE" : "#FCEBEB",
    color: type === "success" ? "#085041" : "#791F1F",
    border: `1px solid ${type === "success" ? "#5DCAA5" : "#F09595"}`,
});

export function RegisterView({ onRegister, onGoLogin, mode }: RegisterViewProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [cpf, setCpf] = useState("");
    const [crm, setCrm] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const isPro = mode === "professional";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirm) {
            setError("As senhas não coincidem.");
            return;
        }

        // Validação de CPF para AMBOS (Médicos também possuem CPF e o sistema exige)
        if (cpf.replace(/\D/g, "").length < 11) {
            setError("CPF inválido. Digite 11 dígitos.");
            return;
        }

        if (isPro && (!crm || !specialty)) {
            setError("CRM e Especialidade são obrigatórios para profissionais.");
            return;
        }

        setLoading(true);
        try {
            await onRegister(name, email, password, cpf, crm, specialty);
            setSuccess("Conta criada com sucesso! Redirecionando para o login...");
            setTimeout(() => {
                onGoLogin();
            }, 2000);
        } catch (err: unknown) {
            const msg: string = err instanceof Error ? err.message : "";
            
            // Melhoria na captura de erro para ser mais específico
            if (msg.toLowerCase().includes("cpf") && msg.toLowerCase().includes("cadastrado")) {
                setError("Este CPF já está cadastrado.");
            } else if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("e-mail")) {
                setError("Este e-mail já está cadastrado.");
            } else {
                setError(msg || "Erro ao criar conta. Verifique os dados.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="unauth-wrap">
            <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div className="brand" style={{ justifyContent: "center", marginBottom: 8 }}>
                        <div className="brand-mark">{isPro ? "P" : "M"}</div>
                        <span>medhub {isPro && <small style={{ fontSize: 10, color: "var(--accent)" }}>PRO</small>}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0 }}>
                        {isPro ? "Cadastro profissional" : "Crie sua conta"}
                    </h2>
                    <p style={{ color: "var(--ink-3)", fontSize: 14, marginTop: 6 }}>
                        {isPro ? "Identifique-se para gerenciar sua agenda" : "Grátis, rápido e sem burocracia"}
                    </p>
                </div>

                <section className="card">
                    {error && <div style={alertStyle("error")}>{error}</div>}
                    {success && <div style={alertStyle("success")}>{success}</div>}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500 }}>Nome completo</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
                        </div>

                        {/* CPF agora é solicitado para todos */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500 }}>CPF</label>
                            <input type="text" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} style={inputStyle} required />
                        </div>

                        {isPro && (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 500 }}>CRM</label>
                                    <input type="text" placeholder="000000/UF" value={crm} onChange={(e) => setCrm(e.target.value)} style={inputStyle} required />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 500 }}>Especialidade</label>
                                    <input type="text" placeholder="Ex: Cardiologia" value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle} required />
                                </div>
                            </>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500 }}>E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500 }}>Senha</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500 }}>Confirmar senha</label>
                            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} required />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading || !!success}>
                            {loading ? "Processando..." : isPro ? "Cadastrar como médico" : "Criar conta"}
                        </button>
                    </form>
                </section>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13.5 }}>
                    Já tem conta? <button onClick={onGoLogin} className="btn-link">Entrar</button>
                </p>
            </div>
        </div>
    );
}