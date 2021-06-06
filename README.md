## Description

A Discord bot for storing quotes from server members and retrieving them randomly like a [magic 8-ball](https://en.wikipedia.org/wiki/Magic_8-Ball).

## Tech Stack
This project makes use of [NestJS](https://nestjs.com/) as the main application framework. Interfacing with the Discord API is handled by the [discord.js](https://discord.js.org/#/) library. [TypeORM](https://typeorm.io/#/) is the ORM of choice for persistence.

This project is also an attempt to put into practice the concepts of Domain-driven Design, CQRS, and Event Sourcing.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

