import { check } from "express-validator";

export const registerValidator = () => {
  return [
    check("firstName")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("lastName")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isEmail()
      .withMessage("EMAIL_IS_NOT_VALID"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ];
};
export const verifyEmailValidator = () => {
  return [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isEmail()
      .withMessage("EMAIL_IS_NOT_VALID"),
    check("otp")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
  ];
};
export const resendVerificationValidator = () => {
  return [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isEmail()
      .withMessage("EMAIL_IS_NOT_VALID"),
  ];
};

export const loginValidator = () => {
  return [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isEmail()
      .withMessage("EMAIL_IS_NOT_VALID"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ];
};
export const forgotPasswordRequestValidator = () => {
  return resendVerificationValidator();
};
export const forgotPasswordValidator = () => {
  return [
    check("email")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isEmail()
      .withMessage("EMAIL_IS_NOT_VALID"),
    check("password")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    check("otp")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
  ];
};
export const changePasswordValidator = () => {
  return [
    check("currentPassword")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    check("newPassword")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ];
};
