import { z } from "zod";

// These constants should ideally be imported from a central types file, 
// but for now, we'll define them here or use what's available.
// Based on the provided code, these are used in CreatePurchaseSchema.
export enum SubscriptionTier {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  GOLD = "GOLD",
}

export enum PaymentProvider {
  GOOGLE_PLAY_STORE = "GOOGLE_PLAY_STORE",
  APPLE_APP_STORE = "APPLE_APP_STORE",
  STRIPE = "STRIPE",
}

export enum DeviceType {
  ANDROID = "android",
  IOS = "ios",
  WEB = "web",
}

export const createPackageSchema = z.object({
  id: z.string().min(1).max(191),
  tier: z.string().min(1).max(50),
  androidPlanId: z.string().min(1).max(191),
  iosPlanId: z.string().min(1).max(191),
  price: z.coerce.number().positive(),
  currency: z.string().length(3).default("USD"),
  duration: z.coerce.number().int().positive(), // duration in days or months? usually days or months.
  features: z.record(z.string(), z.any()).default({}),
  orderIdx: z.coerce.number().int(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
});

export const updatePackageSchema = createPackageSchema.partial().omit({ id: true });

export const getPackagesFilterSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  tier: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const getSubscriptionsFilterSchema = z.object({
  userId: z.coerce.number().int().optional(),
  packageId: z.string().optional(),
  isActive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  platform: z.enum(["ios", "android"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const CreatePurchaseSchema = z
  .object({
    tier: z.nativeEnum(SubscriptionTier).optional(),
    transactionId: z.string().optional(),
    receiptData: z.string().optional(),
    provider: z.nativeEnum(PaymentProvider).optional(),
    platform: z.nativeEnum(DeviceType).optional(),
    originalTransactionId: z.string().optional(),
    purchaseToken: z.string().optional(),
    productId: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const hasPurchaseData =
      data.transactionId ||
      data.receiptData ||
      data.provider ||
      data.platform;

    if (!hasPurchaseData) return;

    if (!data.transactionId) {
      ctx.addIssue({
        path: ["transactionId"],
        message: "transactionId is required",
        code: z.ZodIssueCode.custom
      });
    }

    if (!data.receiptData) {
      ctx.addIssue({
        path: ["receiptData"],
        message: "receiptData is required",
        code: z.ZodIssueCode.custom
      });
    }

    if (!data.provider) {
      ctx.addIssue({
        path: ["provider"],
        message: "provider is required",
        code: z.ZodIssueCode.custom
      });
    }

    if (!data.platform) {
      ctx.addIssue({
        path: ["platform"],
        message: "platform is required",
        code: z.ZodIssueCode.custom
      });
    }

    if (
      data.provider === PaymentProvider.GOOGLE_PLAY_STORE &&
      !data.purchaseToken
    ) {
      ctx.addIssue({
        path: ["purchaseToken"],
        message: "purchaseToken is required for Google Play purchases",
        code: z.ZodIssueCode.custom
      });
    }
  });

export type CreatePackageDto = z.infer<typeof createPackageSchema>;
export type UpdatePackageDto = z.infer<typeof updatePackageSchema>;
export type GetPackagesFilterDto = z.infer<typeof getPackagesFilterSchema>;
export type GetSubscriptionsFilterDto = z.infer<typeof getSubscriptionsFilterSchema>;
export type CreatePurchaseDto = z.infer<typeof CreatePurchaseSchema>;
