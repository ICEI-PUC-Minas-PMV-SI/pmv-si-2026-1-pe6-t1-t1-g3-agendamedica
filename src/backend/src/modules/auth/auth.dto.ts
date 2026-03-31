export interface RegisterDTO {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: "PATIENT" | "DOCTOR" | "RECEPTIONIST";
  specialty?: string; // obrigatório só para médicos
  crm?: string; // obrigatório só para médicos
}

export interface LoginDTO {
  email: string;
  password: string;
}
