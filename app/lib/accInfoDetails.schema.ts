import { z } from "zod";

export const finishAccDetailsSchema = z.object({
  state: z.string().min(2, "State is required"),
  address: z.string().min(5, "Address is required"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .refine(
      (value) => {
        // Allow:
        // 090xxxxxxxx
        // 9012345678
        // +2349012345678
        const isNigerianPhone =
          /^0\d{10}$/.test(value) ||
          /^\d{10}$/.test(value) ||
          /^\+234\d{10}$/.test(value);

        return isNigerianPhone;
      },
      {
        message: "Enter a valid Nigerian phone number",
      },
    ),
});
