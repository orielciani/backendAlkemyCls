const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
// Verify token
exports.verifyToken = (req, res, next)=>{
  const token = req.query.token;
  jwt.verify(token, SEED, (err, decoded)=>{

    if(err) {
      return res.status(401).json({
    ok: false,
    mensaje: 'Token incorrecto'
      })
    }
    
    req.user = decoded.user;
    next();
  });
}