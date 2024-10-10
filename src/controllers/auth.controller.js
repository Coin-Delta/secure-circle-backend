import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AuthService from "../service/auth.service.js";
import UserRepository from "../repositories/user.repository.js";
import CognitoRepository from "../repositories/cognito.repository.js";
import { matchedData } from "express-validator";
import { messages } from "../constants/messages.js";

const authService = new AuthService(
  new UserRepository(),
  new CognitoRepository()
);
export const register = asyncHandler(async (req, res) => {
  const data = matchedData(req);

  await authService.register(data);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, {}, messages.AUTH.REGISTER_SUCCESS));
});
export const login = asyncHandler(async (req, res) => {
  const data = matchedData(req);

  const response = await authService.login(data);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { ...response },
        messages.AUTH.LOGIN_SUCCESS
      )
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const response = await authService.verifyEmail(data);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { email: response.email },
        messages.AUTH.EMAIL_VERIFIED
      )
    );
});
export const resendEmailVerification = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  await authService.resendVerificationEmail(data);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        {},
        messages.AUTH.RESEND_EMAIL_VERIFICATION
      )
    );
});
export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  await authService.forgotPasswordRequest(data);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        {},
        messages.AUTH.FORGOT_PASSWORD_EMAIL_SENT
      )
    );
});
export const forgotPassword = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  await authService.forgotPassword(data);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        {},
        messages.AUTH.FORGOT_PASSWORD_SUCCESSFULLY
      )
    );
});
export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        {},
        messages.AUTH.PASSWORD_CHANGED_SUCCESSFULLY
      )
    );
});
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const response = await authService.refreshAccessToken(req);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { ...response.AuthenticationResult },
        messages.AUTH.REFRESH_TOKEN_GENERATED
      )
    );
});
