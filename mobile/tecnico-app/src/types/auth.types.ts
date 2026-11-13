export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Tecnico {
  id: number;
  usuario: User;
  telefono: string;
  activo: boolean;
  codigo_invitacion: string;
  creado_en: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface JWTDecoded {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}
