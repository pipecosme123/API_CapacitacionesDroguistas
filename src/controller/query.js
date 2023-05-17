const { query } = require("../config/database");

exports.get_data = (req, res, next) => {


   const querySQL = `
   SELECT
      u.id_usuarios,
      u.correo_usuarios,
      u.distribuidor_usuarios,
      u.region_usuarios,
      u.celular_usuarios,
      u.codigo_usuarios,
      u.fechaRegistro,
      CASE WHEN c1.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto1,
      CASE WHEN c2.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto2,
      CASE WHEN c3.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto3,
      CASE WHEN c4.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto4,
      CASE WHEN c5.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto5,
      CASE WHEN c6.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto6
   FROM
   usuarios u
   LEFT JOIN capacitaciones c1 ON u.id_usuarios = c1.id_usuarios AND c1.id_productos = 1
   LEFT JOIN capacitaciones c2 ON u.id_usuarios = c2.id_usuarios AND c2.id_productos = 2
   LEFT JOIN capacitaciones c3 ON u.id_usuarios = c3.id_usuarios AND c3.id_productos = 3
   LEFT JOIN capacitaciones c4 ON u.id_usuarios = c4.id_usuarios AND c4.id_productos = 4
   LEFT JOIN capacitaciones c5 ON u.id_usuarios = c5.id_usuarios AND c5.id_productos = 5
   LEFT JOIN capacitaciones c6 ON u.id_usuarios = c6.id_usuarios AND c6.id_productos = 6
   ;
   `;

   query(querySQL)
      .then((data) => {
         req.body = { rows: data };
         next();
      }).catch((err) => {
         next(err);
      });
}