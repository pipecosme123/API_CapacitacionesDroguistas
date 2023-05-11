const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.createToken = (data) => {
   return jwt.sign({ data }, process.env.SECRET_KEY_TOKEN);
}

exports.verificarToken = (req, res, next) => {
   const bearerHeader = req.headers['authorization'];

   if (bearerHeader !== undefined) {
      const bearerToken = bearerHeader.split(" ")[1];

      jwt.verify(bearerToken, process.env.SECRET_KEY_TOKEN, (error, authData) => {
         if (error) {
            res.status(403).send('Debes iniciar sesión');
         } else {
            req.authData = { usuario: authData.data };
            next();
         }
      });
   } else {
      res.status(401).send('No estas autorizado');
   }
}