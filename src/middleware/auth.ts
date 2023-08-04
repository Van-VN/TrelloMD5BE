import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (authorization) {
    jwt.verify(authorization, process.env.VITE_JWT_SECRET, (err, payload) => {
      if (err) {
        res.status(401).json({
          error: err.message,
          message: 'You are anonymous'
        });
      } else {
        req.decode = payload;
        console.log(req.decode);
        next();
      }
    });
  } else {
    res.status(401).json({
      message: 'You are anonymous'
    });
  }
};
