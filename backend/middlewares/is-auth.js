// import JWT
const jwt = require('jsonwebtoken');

// Verify the token
module.exports = (req, res, next) => {
  // console.log(req.get('Authorization'))
  const authHeader = req.get('Authorization');
  if(!authHeader){
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1]; //Bearer token.......
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET); //token comming from authHeader
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if(!decodedToken){
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
}