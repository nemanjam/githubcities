import { z } from 'zod';

export const nodeEnvValues = ['development', 'test', 'production'] as const;
export const booleanValues = ['true', 'false', ''] as const;
export const modeValues = ['light', 'dark'] as const;

type ZodType = typeof z;

/** For runtime env. */
export const getProcessEnvSchemaProps = (z: ZodType) => ({
  NODE_ENV: z.enum(nodeEnvValues),
  SITE_URL: z.url().regex(/[^/]$/, 'SITE_URL should not end with a slash "/"'),
  API_URL: z.url().regex(/[^/]$/, 'SITE_URL should not end with a slash "/"'),
});

/** For schema type. */
export const processEnvSchema = z.object(getProcessEnvSchemaProps(z));

export const configClientSchema = z.object({
  PAGE_SIZE_TABLE: z.number(),
});
