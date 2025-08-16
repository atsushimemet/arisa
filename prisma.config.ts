import { defineConfig } from '@prisma/client/generator';

export default defineConfig({
  schema: './prisma/schema.prisma',
  seed: 'tsx prisma/seed.ts'
});