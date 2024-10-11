import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors
    .array()
    .forEach((err) => extractedErrors.push({ [err.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new ApiError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    "Received data is not valid",
    extractedErrors
  );
};
