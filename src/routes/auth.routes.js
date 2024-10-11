import { Router } from "express";
import { validate } from "../validator/validate.js";
import {
  changePassword,
  forgotPassword,
  forgotPasswordRequest,
  login,
  refreshAccessToken,
  register,
  resendEmailVerification,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  changePasswordValidator,
  forgotPasswordRequestValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resendVerificationValidator,
  verifyEmailValidator,
} from "../validator/auth.validator.js";

const authRouter = Router();

/*
 * register route
 */

authRouter.route("/register").post(registerValidator(), validate, register);

/*
 * Login route
 */

authRouter.route("/login").post(loginValidator(), validate, login);

/*
 * verify email route
 */

authRouter
  .route("/verify-email")
  .post(verifyEmailValidator(), validate, verifyEmail);

/*
 * resend email verification route
 */

authRouter
  .route("/resend-email-verification")
  .post(resendVerificationValidator(), validate, resendEmailVerification);
/*
 * forgot password request route
 */

authRouter
  .route("/forgot-password-request")
  .post(forgotPasswordRequestValidator(), validate, forgotPasswordRequest);
/*
 * forgot password  route
 */

authRouter
  .route("/forgot-password")
  .post(forgotPasswordValidator(), validate, forgotPassword);
/*
 * change password  route
 */

authRouter
  .route("/change-password")
  .post(changePasswordValidator(), validate, changePassword);
/*
 * Get new refresh token
 */

authRouter.route("/refresh-token").post(refreshAccessToken);

export default authRouter;
