import { StatusCodes } from "http-status-codes";
import UserService from "../service/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserRepository from "../repositories/user.repository.js";
import { messages } from "../constants/messages.js";

const userService = new UserService(new UserRepository());

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAll(req);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, { ...users }, messages.USER.USER_FETCHED)
    );
});

export const getUser = asyncHandler(async (req, res) => {
  const profile = await userService.getUser(req);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, profile, messages.USER.USER_FETCHED));
});

export const getUserById = asyncHandler(async (req, res) => {
  const profile = await userService.getUserById(req);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, profile, messages.USER.USER_FETCHED));
});

export const updateUser = asyncHandler(async (req, res) => {
  const profile = await userService.updateUser(req);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { ...profile },
        messages.USER.USER_UPDATED_SUCCESSFULLY
      )
    );
});

export const verifyUser = asyncHandler(async (req, res) => {
  const profile = await userService.verifyUser(req);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { ...profile },
        messages.USER.USER_VERIFIED_SUCCESSFULLY
      )
    );
});
