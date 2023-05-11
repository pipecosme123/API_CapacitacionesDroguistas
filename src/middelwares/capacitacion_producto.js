exports.capacitacion_producto = (req, res, next) => {

   const { producto } = req.body;

   if (producto) {
      res.send(producto)
   } else {
      res.status(404).send("Capacitación no encontrada");
   }
}