const { createToken } = require("./token");

exports.validateDataUsers = (req, res, next) => {

   const { data } = req.body;

   if (data.length === 0) {

      res.status(403).send("El correo electrónico es incorrecto");

   } else {
      res.status(200).json({
         token: createToken(data[0]),
         correo: data[0].correo
      });
   }
}

exports.organice_data = (req, res, next) => {

   const { droguerias, regiones } = req.body;

   const response = {};

   regiones.forEach(row => {

      const { id, regiones, zona } = row;
      if (!response[regiones]) {
         response[regiones] = [];
      }
      response[regiones].push({ id, zona });

   });

   res.send({
      droguerias,
      regiones: response,
   })

}