import { z } from "zod";

const BaseUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." }),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender.",
  }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required." }),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  className: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export const CreateUserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["ADMIN", "EMPLOYEE"]).default("EMPLOYEE"),
});

export const UpdateUserSchema = BaseUserSchema.partial().extend({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
});
