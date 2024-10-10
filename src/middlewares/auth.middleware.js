import { StatusCodes } from "http-status-codes";
import { messages } from "../constants/messages.js";
import CognitoRepository from "../repositories/cognito.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseCognitoUserAttributes } from "../utils/helpers.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const cognitoRepository = new CognitoRepository();
  const userRepository = new UserRepository();
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const cogUser = await cognitoRepository
      .getUserByAccessToken(token)
      .then((data) => {
        return {
          username: data.Username,
          ...parseCognitoUserAttributes(data.UserAttributes),
        };
      });

    const dbUser = await userRepository.findOne({ email: cogUser.email });

    req.user = dbUser;
    // eslint-disable-next-line callback-return
    next();
  } catch (error) {
    // Client should make a request to /api/v1/auth/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user?._id) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        messages.COMMON.UNAUTHORIZED_REQUEST
      );
    }

    if (roles.includes(req.user?.role)) {
      return next();
    } else {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        messages.COMMON.YOU_ARE_NOT_ALLOWED_TO_PERFORM_THIS_ACTION
      );
    }
  });
