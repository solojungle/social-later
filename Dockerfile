# Use official Bun image
FROM oven/bun:1.1.13-alpine

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add doppler

WORKDIR /app

# Copy entire app codebase first (including prisma/)
COPY . .

# Then install dependencies
RUN bun install --frozen-lockfile

# Entrypoint via Doppler
ENTRYPOINT ["doppler", "run", "--"]

# If you're running a Bun dev server or a Node.js-compatible script
CMD ["sh", "-c", "bun run db:push && bun run dev"]
