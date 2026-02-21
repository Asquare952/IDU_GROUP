import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        // Allow:
        // 090xxxxxxxx
        // 9012345678
        // +2349012345678
        const isNigerianPhone =
          /^0\d{10}$/.test(value) ||
          /^\d{10}$/.test(value) ||
          /^\+234\d{10}$/.test(value);

        return isEmail || isNigerianPhone;
      },
      {
        message: "Enter a valid email or Nigerian phone number",
      },
    ),

  password: z.string().min(8, "Password must be at least 8 characters"),
});
