import { check } from "express-validator";

export const updateUserValidator = () => {
  return [
    check("firstName")
      .optional()
      .isLength({ min: 1, max: 30 })
      .withMessage("INVALID_FIRST_NAME"),
    check("lastName")
      .optional()
      .isLength({ min: 1, max: 30 })
      .withMessage("INVALID_LAST_NAME"),
    check("files").optional(),
    check("isVerified").optional(),
    check("businessName")
      .optional()
      .isLength({ min: 1, max: 30 })
      .withMessage("INVALID_BUSINESS_NAME"),
  ];
};

export const verifyUserValidator = () => {
  return [
    check("isVerified")
      .exists()
      .withMessage("MISSING")
      .not()
      .isEmpty()
      .withMessage("IS_EMPTY"),
  ];
};
