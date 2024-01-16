export interface ILoginInput {
  email: string;
  password: string;
}

export interface AuthState {
  isLogin: boolean;
  loading: boolean;
  error: string | null;
  validatingToken: boolean;
}

export interface IUserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  photos: IPhoto[];
}

export interface IPhoto {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
}
