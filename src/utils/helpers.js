import mongoose from "mongoose";

/**
 * Generates AWS Cognito user attributes from user data object.
 * @param {Object} userData - User data object containing attribute names and values.
 * @returns {Array} An array of user attributes formatted for AWS Cognito.
 */
export const generateCognitoUserAttributes = (userData) => {
  const userAttributes = Object.entries(userData).map(([key, value]) => ({
    Name: key,
    Value: value,
  }));
  return userAttributes;
};

/**
 * Parses AWS Cognito user attributes into a user data object.
 * @param {Array} userAttributes - An array of user attributes from AWS Cognito.
 * @returns {Object} User data object containing attribute names and values.
 */
export const parseCognitoUserAttributes = (userAttributes) => {
  const parsedUserData = {};
  userAttributes.forEach((attribute) => {
    parsedUserData[attribute.Name] = attribute.Value;
  });
  return parsedUserData;
};

export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
  customLabels,
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  };
};

export const toMongoObjectId = (id) => {
  return mongoose.Types.ObjectId.createFromHexString(id);
};

export function buildLookupPipeline(lookupFields) {
  if (!Array.isArray(lookupFields)) {
    throw new Error("Input must be an array of lookup field configurations.");
  }

  const pipelineStages = [];

  lookupFields.forEach(
    ({ from, localField, foreignField, as, unwind = true }) => {
      if (!from || !localField) {
        throw new Error(
          "Each lookup field configuration must contain from and localField properties."
        );
      }

      const lookupStage = {
        $lookup: {
          from,
          localField: localField,
          foreignField: foreignField || "_id",
          as: as || localField,
        },
      };

      pipelineStages.push(lookupStage);
      if (unwind) {
        const unwindStage = {
          $unwind: {
            path: `$${as || localField}`,
            preserveNullAndEmptyArrays: true,
          },
        };
        pipelineStages.push(unwindStage);
      }
    }
  );

  return pipelineStages;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const queryBuilder = (query, isAggregation = false) => {
  const sanitizedQuery = { ...query };

  for (const key in sanitizedQuery) {
    if (mongoose.Types.ObjectId.isValid(sanitizedQuery[key])) {
      sanitizedQuery[key] = toMongoObjectId(sanitizedQuery[key]);
    }
  }
  if (isAggregation) {
    return Object.keys(sanitizedQuery).length
      ? { $match: sanitizedQuery }
      : { $match: {} };
  } else {
    return sanitizedQuery;
  }
};

export const toTitleCase = (str) => {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};

export const sanitizeFilename = (filename) => {
  // Define a regular expression that matches all characters that are not letters, numbers, dots
  const regex = /[^a-zA-Z0-9._-]/g;
  // Replace the matched characters with an empty string
  return filename.replace(regex, "");
};
