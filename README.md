# Nestjs Auth Template

This project was built using nestjs for managing users, roles and permissions and serves as a basis for building other projects.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Diagram ER

![BasicAuth drawio](https://user-images.githubusercontent.com/50376585/204916848-a2c66ad2-73ef-455a-bc25-b2638033cb79.svg)

## Installation

This project uses pnpm as code handler.

1. Clone this repository

   ```bash
   git clone https://github.com/Zuniga63/nest-auth-template.git
   ```

2. Install packages

   ```bash
   pnpm install
   ```

3. Copy the .env.example

   ```bash
   cp .env.example .env
   ```

4. Enter the environment variables related to the database, secret key, cloudinary credentials and mailing data.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Documentation

End point documentation can be accessed at **http://localhost:${PORT}/api-docs/**

![image](https://user-images.githubusercontent.com/50376585/204919366-c911b9a0-6b7a-43f7-a5d1-b671556c1728.png)

The general config of swagger find in [`src/config/swagger.config.ts`](src/config/swagger.config.ts)

## Entities

- **Users**: Entity in charge of using the platform and to which a role can be asigned. [Module](src/modules/users)

- [**Role**](src/modules/roles): Entities to which [permits](src/modules/auth/permission.enum.ts) may be assigned

**Note**: The first user created on the platform is assigned the super administrator property in true and by default disables all platform guards.

## Other Modules

- [**Cloudinary**](src/modules/cloudinary): Module in charge of managing the connection to the file cloud Cloudinary

- [**Mail**](src/modules/mail): Module in charge of sending e-mails.
