import { z } from "zod";

export const CONTACT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const CONTACT_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(254),
  subject: z.string().trim().max(200).optional(),
  serviceInterest: z.string().trim().max(120).optional(),
  deliveryAt: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Choose a valid delivery date and time",
    ),
  budget: z.string().trim().max(80, "Keep the budget under 80 characters").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more about your project")
    .max(5000),
});

export type ContactValues = z.infer<typeof contactSchema>;

export function isAllowedContactAttachment(file: File) {
  if (file.size <= 0 || file.size > CONTACT_ATTACHMENT_MAX_BYTES) return false;
  if (!file.type) return false;
  return (CONTACT_ATTACHMENT_MIME_TYPES as readonly string[]).includes(file.type);
}
