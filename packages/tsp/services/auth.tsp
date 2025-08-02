import "@typespec/http";
import "@typespec/rest";
import "../models/common.tsp";
import "../models/auth.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using SoyokazeAPI;

namespace SoyokazeAPI;

// Authentication API
@route("/auth")
@tag("Authentication")
interface AuthAPI {
  @post
  @route("/login")
  @summary("User login")
  @doc("Authenticate user with email and password")
  login(@body request: LoginRequest): LoginResponse | ErrorResponse;

  @post
  @route("/register")
  @summary("User registration")
  @doc("Register a new user account")
  register(@body request: RegisterRequest): RegisterResponse | ErrorResponse;

  @post
  @route("/refresh")
  @summary("Refresh access token")
  @doc("Get a new access token using refresh token")
  refreshToken(@body request: RefreshTokenRequest): RefreshTokenResponse | ErrorResponse;

  @post
  @route("/logout")
  @summary("User logout")
  @doc("Logout user and invalidate tokens")
  logout(@header Authorization: string): SuccessResponse | ErrorResponse;

  @post
  @route("/forgot-password")
  @summary("Send password reset email")
  @doc("Send password reset instructions to user's email")
  forgotPassword(@body request: ForgotPasswordRequest): SuccessResponse | ErrorResponse;

  @post
  @route("/reset-password")
  @summary("Reset password with token")
  @doc("Reset user password using the token from email")
  resetPassword(@body request: ResetPasswordRequest): SuccessResponse | ErrorResponse;
}

// User Profile API
@route("/user")
@tag("User Profile")
interface UserAPI {
  @get
  @route("/me")
  @summary("Get current user profile")
  @doc("Retrieve the authenticated user's profile information")
  getCurrentUser(@header Authorization: string): UserProfile | ErrorResponse;

  @put
  @route("/me")
  @summary("Update current user profile")
  @doc("Update the authenticated user's profile information")
  updateProfile(
    @header Authorization: string,
    @body request: UpdateProfileRequest
  ): UserProfile | ErrorResponse;

  @put
  @route("/me/password")
  @summary("Change user password")
  @doc("Change the authenticated user's password")
  changePassword(
    @header Authorization: string,
    @body request: ChangePasswordRequest
  ): SuccessResponse | ErrorResponse;

  @delete
  @route("/me")
  @summary("Delete user account")
  @doc("Permanently delete the authenticated user's account")
  deleteAccount(@header Authorization: string): SuccessResponse | ErrorResponse;
}