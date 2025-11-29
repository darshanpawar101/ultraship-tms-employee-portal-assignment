import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import {
  createUser,
  deleteUser,
  getAllEmployees,
  getEmployeeById,
  getEmployeesFilters,
  getTotalCount,
  loginUser,
  normalize,
  updateAttendance,
  updateUser,
} from "../../services/employees.service.js";

export const graphQLResolvers = {
  Query: {
    getAllEmployees: async (parent, args, context) => {
      requireAuth(context);

      const params = normalize(args.params) || {};
      const { page = 1, limit = 10, filters = {} } = params;

      const employeesData = await getAllEmployees(params);

      const employees = employeesData.users;
      const total = employeesData.usersCount;
      const totalPages = Math.ceil(total / limit);

      return {
        employees,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    },

    getEmployeesFilters: async (parent, args, context) => {
      requireAuth(context);

      const employeesFiltersData = await getEmployeesFilters();

      return employeesFiltersData?.[0] || {};
    },

    getEmployeeById: async (parent, args, context) => {
      requireAuth(context);

      if (
        context.user.role === "EMPLOYEE" &&
        context.user._id.toString() !== args.id
      ) {
        throw new Error("You can only view your own profile");
      }

      return await getEmployeeById(args.id);
    },

    me: async (parent, args, context) => {
      requireAuth(context);
      return await getEmployeeById(context.user._id.toString());
    },
  },

  Mutation: {
    login: async (parent, args) => {
      const { username, password } = args.input;
      console.log("login", args.input);
      return await loginUser(username, password);
    },

    addNewUser: async (parent, args, context) => {
      requireRole(context, ["ADMIN"]);
      return await createUser(normalize(args.userData));
    },

    updateUser: async (parent, args, context) => {
      requireAuth(context);
      return await updateUser(args.userId, normalize(args.userData), context);
    },

    updateAttendance: async (parent, args, context) => {
      requireRole(context, ["ADMIN"]);
      return await updateAttendance(args.userId, normalize(args.attendance));
    },

    deleteUser: async (parent, args, context) => {
      requireRole(context, ["ADMIN"]);
      return await deleteUser(args.userId);
    },
  },
};
