interface UnauthViewProps {
    onGoLogin: () => void;
    onGoRegister: () => void;
}

export function UnauthView({ onGoLogin, onGoRegister }: UnauthViewProps) {
    return (
        <div className="unauth-wrap">
            <div className="unauth-hero">
                <div>
                    <div className="page-eyebrow">medhub · saúde em um só lugar</div>
                    <h1
                        className="unauth-title"
                        dangerouslySetInnerHTML={{
                            __html: "Agende consultas <em>com calma</em>, sem ligar para ninguém.",
                        }}
                    />
                    <p className="unauth-sub">
                        Encontre profissionais, escolha horários e receba lembretes automáticos.
                        Presencial ou teleconsulta — do jeito que for melhor pra você.
                    </p>
                    <div className="unauth-actions">
                        <button className="btn btn-primary btn-lg" onClick={onGoLogin}>
                            Entrar
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={onGoRegister}>
                            Criar conta gratuita
                        </button>
                    </div>
                </div>
                <div className="unauth-visual" aria-hidden="true">
                    {"/* hero art\n   paciente em\n   consulta */"}
                </div>
            </div>
        </div>
    );
}
