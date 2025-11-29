import { generateToken } from "../middleware/auth.middleware.js";
import { User } from "../model/Users.model.js";

export const normalize = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const createUser = async (params) => {
  try {
    const { username, password, name, gender, role, dateOfBirth } = params;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const user = await User.create({
      name,
      username,
      password,
      gender,
      role: role || "EMPLOYEE",
      dateOfBirth: new Date(dateOfBirth),
    });

    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

const updateUser = async (userId, params, context) => {
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (
      context.user.role === "employee" &&
      context.user._id.toString() !== userId
    ) {
      throw new Error("You cannot update this profile");
    }

    if (
      context.user.role === "employee" &&
      params.role &&
      params.role !== existingUser.role
    ) {
      throw new Error("You cannot change your role");
    }

    const updateFields = { ...params };
    if (updateFields.dateOfBirth) {
      updateFields.dateOfBirth = new Date(updateFields.dateOfBirth);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    return updatedUser.toObject();
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

const getEmployeesFilters = async () => {
  return await User.aggregate([
    {
      $group: {
        _id: null,

        roles: {
          $addToSet: {
            $cond: [
              { $or: [{ $eq: ["$role", ""] }, { $eq: ["$role", null] }] },
              "$$REMOVE",
              "$role",
            ],
          },
        },

        genders: {
          $addToSet: {
            $cond: [
              { $or: [{ $eq: ["$gender", ""] }, { $eq: ["$gender", null] }] },
              "$$REMOVE",
              "$gender",
            ],
          },
        },

        classNames: {
          $addToSet: {
            $cond: [
              {
                $or: [
                  { $eq: ["$className", ""] },
                  { $eq: ["$className", null] },
                ],
              },
              "$$REMOVE",
              "$className",
            ],
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
};

const getAllEmployees = async (params) => {
  try {
    let { filters = {}, page = 1, limit = 10, sort } = params;

    if (Object.keys(sort).length === 0) {
      sort = {
        createdAt: -1,
      };
    }

    const skip = page > 0 ? (page - 1) * limit : 0;
    const {
      gender = [],
      className = [],
      role = [],
      maxAge = null,
      minAge = null,
    } = filters;

    let matchQuery = {};

    if (gender && gender.length) {
      matchQuery.gender = { $in: gender };
    }
    if (role && role.length) {
      matchQuery.role = { $in: role };
    }
    if (className && className.length) {
      matchQuery.className = { $in: className };
    }

    let basePipeline = [];

    if (Object.keys(matchQuery).length > 0) {
      basePipeline.push({ $match: matchQuery });
    }

    basePipeline.push({
      $addFields: {
        age: {
          $toInt: {
            $divide: [
              { $subtract: [new Date(), "$dateOfBirth"] },
              365.25 * 24 * 60 * 60 * 1000,
            ],
          },
        },
      },
    });

    if (Number.isInteger(maxAge) || Number.isInteger(minAge)) {
      let ageMatch = {};
      if (Number.isInteger(minAge)) {
        ageMatch.$gte = minAge;
      }
      if (Number.isInteger(maxAge)) {
        ageMatch.$lte = maxAge;
      }
      basePipeline.push({ $match: { age: ageMatch } });
    }

    basePipeline.push({ $sort: sort });

    let paginationPipeline = [...basePipeline];

    paginationPipeline.push({ $skip: skip });
    paginationPipeline.push({ $limit: limit });

    paginationPipeline.push({
      $project: {
        password: 0,
      },
    });

    basePipeline.push({ $count: "total" });

    const usersQuery = await User.aggregate(paginationPipeline);
    const usersCountQuery = await User.aggregate(basePipeline);

    const [users, usersCount] = await Promise.all([
      usersQuery,
      usersCountQuery,
    ]);

    return { users, usersCount: usersCount?.[0]?.total || 0 };
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    throw error;
  }
};

const getEmployeeById = async (id) => {
  try {
    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      throw new Error("Employee not found");
    }

    if (user.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(user.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      user.age = age;
    }

    return user;
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      token,
      user: userObj,
    };
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

const updateAttendance = async (userId, attendanceData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.attendance = {
      ...user.attendance,
      ...attendanceData,
    };

    if (user.attendance.totalDays > 0) {
      user.attendance.percentage =
        (user.attendance.presentDays / user.attendance.totalDays) * 100;
    }

    await user.save();

    return user.toObject();
  } catch (error) {
    console.error("Error in updateAttendance:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, message: "User deleted successfully", user };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};

const getTotalCount = async (filters = {}) => {
  try {
    const { name = [], role = [], maxAge = null, minAge = null } = filters;
    let matchQuery = {};

    if (name && name.length > 0) {
      matchQuery.name = { $in: name };
    }
    if (role && role.length > 0) {
      matchQuery.role = { $in: role };
    }

    let pipeline = [];
    if (Object.keys(matchQuery).length > 0) {
      pipeline.push({ $match: matchQuery });
    }

    if (Number.isInteger(maxAge) || Number.isInteger(minAge)) {
      pipeline.push({
        $addFields: {
          age: {
            $divide: [
              { $subtract: [new Date(), "$dateOfBirth"] },
              365.25 * 24 * 60 * 60 * 1000,
            ],
          },
        },
      });

      let ageMatch = {};
      if (Number.isInteger(minAge)) ageMatch.$gte = minAge;
      if (Number.isInteger(maxAge)) ageMatch.$lte = maxAge;
      pipeline.push({ $match: { age: ageMatch } });
    }

    pipeline.push({ $count: "total" });

    const result = await User.aggregate(pipeline);
    return result[0]?.total || 0;
  } catch (error) {
    console.error("Error in getTotalCount:", error);
    return 0;
  }
};

export {
  createUser,
  updateUser,
  getAllEmployees,
  getEmployeeById,
  updateAttendance,
  getTotalCount,
  deleteUser,
  loginUser,
  getEmployeesFilters,
};
