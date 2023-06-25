const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

const verifyJwt = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-j5c8r52qumbdfppi.us.auth0.com/.well-known/jwks.json',
    }),
    audience: 'this api is created first time for testing purposse',
    issuer: 'https://dev-j5c8r52qumbdfppi.us.auth0.com/',
    algorithm: ['RS256'],
  })

export default verifyJwt;