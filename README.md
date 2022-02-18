# [Northcoders News API](https://nc-news-chris.herokuapp.com/)

[NC News Chris](https://nc-news-chris.herokuapp.com/) is a back-end JS project, creating various server endpoints. 
This project is designed to demonstrate several types of requests the server receives and how the server processes 
these requests in order to provide the required responses. These requests include:

- GET
- POST
- PATCH
- DELETE

This project was envisioned using a TDD approach and, as a result, all parameters are carefully tested for successful 
and unsuccessful request-responses, leading to specific errors in the result of an error.
## Run Locally
### Requirements

node - v17.3.0\
PostgreSQL 12.9 

### Cloning & Set-up

#### Clone the project

```bash
  git clone https://github.com/MrChris-H/nc-news-chris.git
```

#### Go to the project directory

```bash
  cd nc-news-chris
```

#### Install dependencies

```bash
  npm install
```

### Environment Variables
Create 2 .env files to gain access to the testing or development DBs conditionally. 
#### .env.development containing:

```
PGDATABASE=nc_news
```

#### .env.test containing:

```
PGDATABASE=nc_news_test
```
### Seeding & Starting
#### Set-up local databases 

```bash
  npm run setup-dbs
```

#### Seed local databases

```bash
  npm run seed
```

#### Start the server

```bash
  npm run start
```


## Running Tests

To run all tests, run the following command

```bash
  npm run test
```

To run app tests, run the following command

```bash
  npm run test-app
```

To run utils tests, run the following command

```bash
  npm run test-utils
```
## Tech Stack

**Server:** Node, Express


