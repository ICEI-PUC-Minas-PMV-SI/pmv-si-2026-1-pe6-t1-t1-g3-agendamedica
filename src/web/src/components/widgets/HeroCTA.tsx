import { Ic } from "../../lib/icons";
import type { User } from "../../lib/types";

interface HeroCTAProps {
    user: User;
    onSchedule: () => void;
}

export function HeroCTA({ user, onSchedule }: HeroCTAProps) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    const firstName = user.name.split(" ")[0];

    return (
        <div className="hero">
            <div>
                <div className="page-eyebrow" style={{ marginBottom: 10 }}>
                    {greet}, {firstName.toLowerCase()} ——
                </div>
                <h2
                    className="hero-title"
                    dangerouslySetInnerHTML={{
                        __html: "Pronta para cuidar da sua <em>saúde hoje</em>?<br/>Agende em menos de <em>60 segundos</em>.",
                    }}
                />
                <p className="hero-sub">
                    Escolha especialidade, horário e a clínica mais perto de você. Você recebe
                    confirmação automática e lembretes por e-mail e push.
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" onClick={onSchedule}>
                        <Ic.plus size={16} /> Agendar consulta
                    </button>
                    <button className="btn btn-secondary btn-lg">
                        <Ic.video size={16} /> Teleconsulta agora
                    </button>
                </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
                {"/* visual\n   ilustrativo\n   — consulta */"}
            </div>
        </div>
    );
}
