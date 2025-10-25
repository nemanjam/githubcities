// @ts-nocheck

import { defineConfig } from '@hey-api/openapi-ts';

const config = defineConfig({
  input: './openapi.json',
  output: './src/client',
  exportSchemas: true, // backend model types
  plugins: [
    '@hey-api/client-axios',
    // '@hey-api/client-next',
    {
      name: '@hey-api/sdk',
      asClass: false, // 'true' doesn't allow tree-shaking
      operationId: true,
      methodNameBuilder: (operation) => {
        // fallback if name is undefined
        let name = operation.name as string;
        const service = operation.service as string;

        // Remove service prefix from name, UserLogin -> Login
        if (service && name.toLowerCase().startsWith(service.toLowerCase())) {
          name = name.slice(service.length);
        }

        // Remove invalid characters and convert to camelCase
        name = name
          // handle hyphens, underscores, spaces
          .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
          // remove any remaining invalid characters
          .replace(/[^a-zA-Z0-9]/g, '');

        // lowercase first character
        return name.charAt(0).toLowerCase() + name.slice(1);
      },
    },
  ],
});

export default config;
