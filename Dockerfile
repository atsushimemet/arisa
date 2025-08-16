FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Copy Prisma schema for postinstall script
COPY prisma ./prisma
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Diagnostic step to verify dependencies are present
RUN npm ls @prisma/client prisma --depth=0 || true

# Health check: Verify Prisma Client was generated correctly in deps stage
RUN node -e "require('@prisma/client'); console.log('Prisma Client OK')"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files first
COPY package.json package-lock.json* ./

# Copy Prisma files before installing dependencies
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies for the runner stage
RUN npm ci --only=production && npm cache clean --force

# Copy generated Prisma client from builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy migration script
COPY --from=builder /app/scripts ./scripts
RUN chmod +x scripts/migrate-and-seed.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["sh", "-c", "./scripts/migrate-and-seed.sh && node server.js"]