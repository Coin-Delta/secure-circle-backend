# circle-secure-backend

## Features

- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await
- CORS enabled
- Uses [pnpm](https://pnpm.io/)
- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- [Docker](https://www.docker.com/) support
- Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)

- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Authentication and Authorization with [aws cognito](https://aws.amazon.com/cognito/)

## Requirements

- [Node v20.1 +](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/)

## Getting Started

#### Install dependencies:

```bash
pnpm install
```

#### Set environment variables:

```bash
cp .env.example .env
```

- Set your Mongo cluster uri
- set your AWS configurations

## Running Locally

```bash
pnpm run dev
```

## Running in Production

```bash
pnpm run prod
```
