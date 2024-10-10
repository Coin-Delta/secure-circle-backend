import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import { messages } from "../constants/messages.js";
class AuthService {
  constructor(userRepository, cognitoRepository) {
    this.userRepository = userRepository;
    this.cognitoRepository = cognitoRepository;
  }

  async register(userData) {
    const isUserExistInCognito = await this.cognitoRepository.getUserByEmail(
      userData.email
    );
    if (isUserExistInCognito) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.EMAIL_EXIST
      );
    }

    const isUserExistInDatabase = await this.userRepository.findOne({
      email: userData.email,
    });

    if (isUserExistInDatabase) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.EMAIL_EXIST
      );
    }

    await this.cognitoRepository.create(userData);
    const dbUser = await this.userRepository.create(userData);

    return { email: dbUser.email };
  }
  async login(userData) {
    try {
      const user = await this.cognitoRepository.getUserByEmail(userData.email);
      if (!user) {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.EMAIL_NOT_EXIST
        );
      }

      if (user.UserStatus === "UNCONFIRMED") {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.EMAIL_NOT_VERIFIED
        );
      }

      const token = await this.cognitoRepository.login(userData);

      const userInDb = await this.userRepository.findOne({
        email: userData.email,
      });

      return {
        user: userInDb,
        token: {
          AccessToken: token.AuthenticationResult.AccessToken,
          ExpiresIn: token.AuthenticationResult.ExpiresIn,
          RefreshToken: token.AuthenticationResult.RefreshToken,
          TokenType: token.AuthenticationResult.TokenType,
        },
      };
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          messages.AUTH.INVALID_CREDENTIALS
        );
      } else {
        throw error;
      }
    }
  }
  async verifyEmail(req) {
    try {
      const { email, otp } = req;

      await this.cognitoRepository.verifyEmail(email, otp);
      const user = await this.userRepository.findOne({ email });
      user.isEmailVerified = true;
      user.save();
      return {
        email: email,
      };
    } catch (error) {
      if (error.name === "ExpiredCodeException") {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.OTP_EXPIRED
        );
      } else if (error.name === "CodeMismatchException") {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.OTP_INVALID
        );
      } else {
        throw error;
      }
    }
  }

  async resendVerificationEmail(req) {
    const userExistInDb = await this.userRepository.findOne({
      email: req.email,
    });
    if (!userExistInDb) {
      throw new ApiError(StatusCodes.NOT_FOUND, messages.AUTH.EMAIL_NOT_EXIST);
    }
    const user = await this.cognitoRepository.getUserByEmail(req.email);

    if (!user) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.EMAIL_NOT_EXIST
      );
    }
    if (user.UserStatus === "CONFIRMED") {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.EMAIL_ALREADY_VERIFIED
      );
    }

    await this.cognitoRepository.resendEmailVerification(req.email);
  }
  async forgotPasswordRequest(req) {
    const user = await this.cognitoRepository.getUserByEmail(req.email);

    if (!user) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.EMAIL_NOT_EXIST
      );
    }

    if (!user.Enabled) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        messages.AUTH.USER_DISABLED
      );
    }

    return await this.cognitoRepository.forgotPasswordRequest(req.email);
  }
  async forgotPassword(req) {
    try {
      const user = await this.cognitoRepository.getUserByEmail(req.email);

      if (!user) {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.EMAIL_NOT_EXIST
        );
      }

      if (!user.Enabled) {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.USER_DISABLED
        );
      }

      return await this.cognitoRepository.forgotPassword(req);
    } catch (error) {
      if (error.name === "ExpiredCodeException") {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          messages.AUTH.FORGOT_PASSWORD_OTP_EXPIRED
        );
      } else if (error.name === "CodeMismatchException") {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          messages.AUTH.FORGOT_PASSWORD_OTP_INVALID
        );
      } else {
        throw error;
      }
    }
  }
  async changePassword(req) {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          messages.AUTH.UNAUTHORIZED
        );
      }

      const user = await this.cognitoRepository.changePassword(accessToken, {
        ...req.body,
      });

      return user;
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        throw new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          messages.AUTH.INVALID_CREDENTIALS
        );
      }
      throw error;
    }
  }
  async refreshAccessToken(req) {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, messages.AUTH.UNAUTHORIZED);
    }

    const token =
      await this.cognitoRepository.refreshAccessToken(incomingRefreshToken);

    return token;
  }
}

export default AuthService;
