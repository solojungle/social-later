# Use official Node.js Alpine image
FROM node:23.11-alpine

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add --no-cache doppler

WORKDIR /app

# Copy package files and prisma schema early for install + generate
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy rest of the app
COPY . .

# Generate Prisma client (if not handled in postinstall)
RUN npx prisma generate

# Entrypoint via Doppler
ENTRYPOINT ["doppler", "run", "--"]

# Start command (adjust if needed)
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
