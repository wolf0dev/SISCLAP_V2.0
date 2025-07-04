export interface User {
  id: number;
  nom_user: string;
  pass_user: string;
  id_rol_user: number;
  user: string;
  ced_user: string;
  correo: string;
  id_calle: number;
  foto_perfil: string | null;
}

export interface LoginRequest {
  user: string;
  pass_user: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  nom_user: string;
  pass_user: string;
  id_rol_user: number;
  user: string;
  ced_user: string;
  correo: string;
  id_calle: number;
  foto_perfil: string | null;
}

export interface RegisterRequest {
  nom_user: string;
  pass_user: string;
  id_rol_user: number;
  user: string;
  ced_user: string;
  correo: string;
  id_calle: number;
  foto_perfil: string | null;
}

export interface RecoverPasswordRequest {
  correo: string;
  ced_user: string;
}

export interface RecoverPasswordResponse {
  message: string;
  Usuario: string;
  NuevaContraseña: string;
}

export interface UpdateUserRequest {
  id: number;
  nom_user: string;
  id_rol_user: number;
  user: string;
  ced_user: string;
  correo: string;
  id_calle: number;
  foto_perfil: string | null;
}

export interface UpdatePasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export interface RecoverUserRequest {
  ced_user: string;
  nom_user: string;
}

export interface RecoverUserResponse {
  message: string;
  Usuario: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UpdateUserRequest) => Promise<void>;
  updatePassword: (passwordData: UpdatePasswordRequest) => Promise<void>;
  recoverPassword: (data: RecoverPasswordRequest) => Promise<RecoverPasswordResponse>;
  recoverUser: (data: RecoverUserRequest) => Promise<RecoverUserResponse>;
}