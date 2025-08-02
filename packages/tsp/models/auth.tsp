import "./common.tsp";

using SoyokazeAPI;

namespace SoyokazeAPI;

// User models
model User {
  id: string;
  email: Email;
  name: string;
  avatar?: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model UserProfile {
  id: string;
  email: Email;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

// Authentication request models
model LoginRequest {
  email: Email;
  password: Password;
}

model RegisterRequest {
  email: Email;
  name: Name;
  password: Password;
  confirmPassword: Password;
}

model RefreshTokenRequest {
  refreshToken: string;
}

model ForgotPasswordRequest {
  email: Email;
}

model ResetPasswordRequest {
  token: string;
  password: Password;
  confirmPassword: Password;
}

model ChangePasswordRequest {
  currentPassword: string;
  newPassword: Password;
  confirmPassword: Password;
}

model UpdateProfileRequest {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

// Authentication response models
model LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: int32;
}

model RegisterResponse {
  user: User;
  message: string;
}

model RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: int32;
}