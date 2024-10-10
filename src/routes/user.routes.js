import { Router } from "express";
import {
  getUser,
  getUserById,
  getUsers,
  updateUser,
  verifyUser,
} from "../controllers/user.controller.js";
import { validate } from "../validator/validate.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import {
  updateUserValidator,
  verifyUserValidator,
} from "../validator/user.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/all").get(getUsers);

userRouter
  .route("/")
  .get(verifyJWT, getUser)
  .put(
    verifyJWT,
    upload.fields([
      {
        name: "businessLogo",
        maxCount: 1,
      },
      {
        name: "files[identification]",
        maxCount: 1,
      },
      {
        name: "files[businessLicense]",
        maxCount: 1,
      },
    ]),
    updateUserValidator(),
    validate,
    updateUser
  );

userRouter
  .route("/:userId")
  .get(getUserById)
  .put(
    verifyJWT,
    verifyPermission(["ADMIN"]),
    verifyUserValidator(),
    validate,
    verifyUser
  );

export default userRouter;
