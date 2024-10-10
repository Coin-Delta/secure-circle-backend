FROM node:22-alpine

# Create the working directory and set appropriate ownership
RUN mkdir -p /usr/src/lib-nodejs && chown -R node:node /usr/src/lib-nodejs

WORKDIR /usr/src/lib-nodejs

#  Set environment variables
ENV PATH /usr/src/lib-nodejs/node_modules/.bin:$PATH

# Install PNPM globally
RUN npm install -g pnpm

# Copy package json and pnpm lockfile to optimize the image building
COPY package.json pnpm-lock.yaml ./

# Copy prepare.js prior. It will be executed after package installation and before ROOT dir is cloned
COPY prepare.js ./
COPY .env.example .env
# Switch to the node user
USER node

# Install dependencies using PNPM
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code and set the ownership
COPY --chown=node:node . .

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["pnpm","run", "prod"]
