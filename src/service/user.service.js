import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import {
  getMongoosePaginationOptions,
  queryBuilder,
} from "../utils/helpers.js";
import { messages } from "../constants/messages.js";
import {
  getKeyFromSignedUrl,
  getSignedUrlFromS3,
  uploadToS3,
} from "../utils/s3Bucket.js";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create(userData) {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(req) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      isVerified,
      ...query
    } = req.query;

    const matchStage = queryBuilder(query, true);
    if (isVerified !== undefined) {
      matchStage["$match"].isVerified = isVerified === "true"; // Convert "true"/"false" string to boolean
    }

    const sortOrderInt = sortOrder === "asc" ? 1 : -1;

    const userAggregate = [
      matchStage,
      {
        $sort: {
          [sortBy]: sortOrderInt,
        },
      },
    ];

    const result = await this.userRepository.aggregatePaginate(
      userAggregate,
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: "totalUsers",
          docs: "users",
        },
      })
    );

    const updatedUsers = await Promise.all(
      result.users.map(async (items) => {
        if (items.files.identification) {
          items.files.identification = await getSignedUrlFromS3(
            items.files.identification
          );
        }
        if (items.files.businessLicense) {
          items.files.businessLicense = await getSignedUrlFromS3(
            items.files.businessLicense
          );
        }

        return items;
      })
    );

    const pendingUsers = await this.userRepository.findAll({
      isVerified: false,
      role: "MERCHANT",
    });
    const verifiedUsers = await this.userRepository.findAll({
      isVerified: true,
      role: "MERCHANT",
    });

    return {
      ...result,
      users: updatedUsers,
      pendingUsers: pendingUsers.length,
      verifiedUsers: verifiedUsers.length,
    };
  }

  async getUser(req) {
    let reqUser = req.user;

    const user = await this.userRepository.findById(reqUser?._id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, messages.COMMON.NOT_FOUND);
    }

    if (user.files.identification) {
      user.files.identification = await getSignedUrlFromS3(
        user.files.identification
      );
    }
    if (user.files.businessLicense) {
      user.files.businessLicense = await getSignedUrlFromS3(
        user.files.businessLicense
      );
    }

    return user;
  }

  async getUserById(req) {
    const { userId } = req.params;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, messages.COMMON.NOT_FOUND);
    }

    if (user.files.identification) {
      user.files.identification = await getSignedUrlFromS3(
        user.files.identification
      );
    }
    if (user.files.businessLicense) {
      user.files.businessLicense = await getSignedUrlFromS3(
        user.files.businessLicense
      );
    }

    return user;
  }

  async updateUser(req) {
    let reqUser = req.user;
    const data = req.body;

    if (data.files && data.files.identification) {
      const identification = await getKeyFromSignedUrl(
        data.files.identification
      );

      data.files = { ...data.files, identification };
    }
    if (data?.files && data.files.businessLicense) {
      const businessLicense = await getKeyFromSignedUrl(
        data.files.businessLicense
      );

      data.files = { ...data.files, businessLicense };
    }

    if (typeof req.files["files[identification]"] === "object") {
      const identification = await uploadToS3(
        req.files["files[identification]"][0].path
      );
      data.files = { ...data.files, identification };
    }

    if (typeof req.files["files[businessLicense]"] === "object") {
      const businessLicense = await uploadToS3(
        req.files["files[businessLicense]"][0].path
      );

      data.files = { ...data.files, businessLicense };
    }

    const updatedUser = await this.userRepository.update(reqUser?._id, {
      ...data,
    });

    return {
      result: updatedUser,
    };
  }

  async verifyUser(req) {
    const data = req.body;
    const { userId } = req.params;

    const updatedUser = await this.userRepository.update(userId, {
      ...data,
    });

    return {
      result: updatedUser,
    };
  }
}

export default UserService;
