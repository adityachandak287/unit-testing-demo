# Unit Testing Demo

## Commands

Run tests

```
npm run test
```

Run tests in watch mode

```
npm run test:watch
```

Run tests in watch mode and serve coverage report

```
npm run test-and-serve
```

<details>
  <summary><h2>API documentation</h2></summary>

### GET /hello

```json
{ "msg": "Hello World" }
```

### GET /

Get all users

```json
[
  {
    "id": 1,
    "name": "test",
    "email": "test@example.com"
  }
]
```

### GET /<id>

Get user by id

```json
{
  "id": 3,
  "name": "test",
  "email": "test@example.com"
}

// Error Response if user does not exist
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### POST /

Create user

```json
// Request Body
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}

// Response
{
  "id": 2,
  "name": "John Doe",
  "email": "johndoe@example.com"
}

// Error Response
{
  "statusCode": 400,
  "message": "Bad Request"
}
```

### PATCH /<id>

Create user

```json
// Request Body
{
  "name": "John Cena"
}

// Response
{ "success": true }

// Error Response
// If update fails
{
  "statusCode": 400,
  "message": "Bad Request"
}
// If user does not exist
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### DELETE /<id>

Delete user by id

```json
// Response
{ "success": true }

// Error Response if user does not exist
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### POST /pay

Verify if payment in given currency is valid for given amount in INR

```json
// Request Body
{
  "amountPaid": 10,
  "currency": "USD",
  "inrToPay": 500
}

// Response
{ "success": true }

// Error Response
// If currency is not valid
{
    "statusCode": 400,
  "message": "Invalid currency",
  "error": "Bad Request"
}

// If given currency amount converted to INR is not >= inrToPay
{
  "statusCode": 400,
  "message": "Insufficient amount",
  "error": "Bad Request"
}
```

</details>

## Credits

- [Currency API](https://github.com/fawazahmed0/currency-api)

## Resources

- [Prisma Docs - Testing](https://www.prisma.io/docs/guides/testing/unit-testing)
- [NestJS Docs - Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Docs](https://jestjs.io/docs/28.x/getting-started)
