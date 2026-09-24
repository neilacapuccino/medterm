// STEP 4 - zod schemas (rules for what the client is allowed to send)
import { z } from "zod";


// ========================================
// AUTH
// ========================================

export const authBodySchema = z.object({
  email: z.email("Must be a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

// "Zod Login" in the spec table -> POST /api/auth/login
export const loginSchema = z.object({
  body: authBodySchema,
});

export const serviceBodySchema = z.object({
   name: z
    .string()
    .min(3, "name is required")
    .max(60, "name is too long"),

  endpoointUrl: z
    .string(),
    
  environment: z
    .enum(['DEVELOPMENT', 'STAGING', 'PRODUCTION'])
    .default("DEVELOPMENT"),
    
  status: z
    .enum(['HEALTHY', 'DEGRADED', 'DOWN'])
    .default("HEALTHY"),
  version: z
    .string(),
});

export const createServiceSchema = z.object({
  body: serviceBodySchema,
});

// PATCH /api/incidents/:id -> spec: "UPDATE Status/Severity" -> ONLY these 2 fields
export const updateServiceSchema = z.object({
  body: z.object({
    environment: z.enum(['DEVELOPMENT', 'STAGING', 'PRODUCTION']).optional(),
    status: z.enum(['HEALTHY', 'DEGRADED', 'DOWN']).optional(),
  }),

  params: z.object({
    id: z.uuid("ID must be a valid id"),
  }),
});
