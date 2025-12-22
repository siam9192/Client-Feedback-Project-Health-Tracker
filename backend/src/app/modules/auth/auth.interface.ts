export interface UserRegistrationPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface UserLoginPayload {
  identifier: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
