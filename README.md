# Code Challenge

## Technologies Used

<p align='center'>
  <img src="https://img.shields.io/badge/GraphQL--foo?logo=graphql&color=E10098" alt="drawing" />
 <img src="https://img.shields.io/badge/TypeScript--foo?logo=typescript&color=3178C6&logoColor=fff" alt="drawing" />
 <img src="https://img.shields.io/badge/NestJS--foo?logo=nestjs&color=E0234E" alt="drawing" />
 <img src="https://img.shields.io/badge/Redis--foo?logo=redis&color=FF4438&logoColor=fff" alt="drawing" />
 <img src="https://img.shields.io/badge/PostgreSQL--foo?logo=postgresql&color=4169E1&logoColor=fff" alt="drawing" />
 <img src="https://img.shields.io/badge/TypeORM--foo?logo=typeorm&color=FE0803&logoColor=fff" alt="drawing" />
 <img src="https://img.shields.io/badge/Docker--foo?logo=docker&color=2496ED&logoColor=fff" alt="drawing" />
 <img src="https://img.shields.io/badge/.ENV--foo?logo=dotenv&color=ECD53F&logoColor=fff" alt="drawing" />
</p>

## Description

<img src="./diagram.png" alt="Access Denied Picture">

This API was developed as part of a challenge, and it must contemplate the data flow in the diagram below. After starting for the first time, and with the database empty, the Service searches for the XML with the Makes information in the data API address, about the vehicle types it was mocked, and for more details you can see in [Important](#important). Thinking about the performance and excessive use of the database, each call is cached for 5 minutes, and for this I used Redis.

## Project setup

```bash
docker compose up
```

After running this command, and waiting for the system to search for the XML list with the Makes for the first time, you will be able to access the GraphQL playground at the address below:

```bash
http://localhost:3000/graphql
```

Example Query:

```graphql
{
   GetMake(makeId: 7439){
    makeId,
    makeName,
    vehicleTypes{
      typeId
      typeName
    }
  }
  GetMakes{
    makeId,
    makeName,
    vehicleTypes{
      typeId
      typeName
    }
  }
}

```

## Run tests

```bash
# unit tests
$ npm run test
```

## Important

Due to the rate limit, as we can see in the print below, I decided to generate mocked data for the vehicle types, however in the file [MakeService](/src/application/services/make.service.ts)., it is still possible to see the implementation searching for the API, for reasons of leaving a record that it was developed.
<img src="./acess_denied.png" alt="Access Denied Picture">
