const { db_query } = require("../config/database");

exports.get_data = async (req, res, next) => {
  const total = [];

  const querySQL1 = `SELECT 
  U.id_usuarios, U.correo, D.distribuidores, 
  CASE WHEN U.occ = 1 THEN 'SI' ELSE '-' END AS occ,
   CASE WHEN  U.occ = 1 THEN '-' ELSE R.regiones END AS regiones,
   CASE WHEN  U.occ = 1 THEN '-' ELSE Z.zonas END AS zonas,
  IFNULL((SELECT punto_venta FROM users WHERE punto_venta = 999999), '--') AS puntos_venta, 
  U.celular, U.codigo, U.fechaRegistro, 
  CASE WHEN C1.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto1,
  CASE WHEN C2.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto2,
  CASE WHEN C3.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto3,
  CASE WHEN C4.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto4,
  CASE WHEN C5.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto5,
  CASE WHEN C6.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto6
FROM
  users U
      LEFT JOIN
  capacitaciones C1 ON U.id_usuarios = C1.id_usuarios
      AND C1.id_productos = 1
      LEFT JOIN
  capacitaciones C2 ON U.id_usuarios = C2.id_usuarios
      AND C2.id_productos = 2
      LEFT JOIN
  capacitaciones C3 ON U.id_usuarios = C3.id_usuarios
      AND C3.id_productos = 3
      LEFT JOIN
  capacitaciones C4 ON U.id_usuarios = C4.id_usuarios
      AND C4.id_productos = 4
      LEFT JOIN
  capacitaciones C5 ON U.id_usuarios = C5.id_usuarios
      AND C5.id_productos = 5
      LEFT JOIN
  capacitaciones C6 ON U.id_usuarios = C6.id_usuarios
      AND C6.id_productos = 6
      JOIN
  distribuidores D ON U.distribuidor = D.id_distribuidores
      INNER JOIN
  zonas Z ON U.punto_venta = Z.id_zonas
      INNER JOIN
  regiones R ON Z.id_regiones = R.id_regiones
  WHERE U.id_usuarios > 2 AND U.id_usuarios <= 4447
  ORDER BY id_usuarios ASC;`;

  const querySQL2 = `
   SELECT 
   U.id_usuarios, U.correo, D.distribuidores, 
   CASE WHEN U.occ = 1 THEN 'SI' ELSE '-' END AS occ,
   R.regiones, Z.zonas, PV.puntos_venta, U.celular, U.codigo, U.fechaRegistro, 
   CASE WHEN C1.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto1,
   CASE WHEN C2.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto2,
   CASE WHEN C3.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto3,
   CASE WHEN C4.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto4,
   CASE WHEN C5.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto5,
   CASE WHEN C6.id_capacitaciones IS NOT NULL THEN 'Visto' ELSE 'No' END AS producto6
FROM
   users U
       LEFT JOIN
   capacitaciones C1 ON U.id_usuarios = C1.id_usuarios
       AND C1.id_productos = 1
       LEFT JOIN
   capacitaciones C2 ON U.id_usuarios = C2.id_usuarios
       AND C2.id_productos = 2
       LEFT JOIN
   capacitaciones C3 ON U.id_usuarios = C3.id_usuarios
       AND C3.id_productos = 3
       LEFT JOIN
   capacitaciones C4 ON U.id_usuarios = C4.id_usuarios
       AND C4.id_productos = 4
       LEFT JOIN
   capacitaciones C5 ON U.id_usuarios = C5.id_usuarios
       AND C5.id_productos = 5
       LEFT JOIN
   capacitaciones C6 ON U.id_usuarios = C6.id_usuarios
       AND C6.id_productos = 6
       JOIN
   distribuidores D ON U.distribuidor = D.id_distribuidores
       JOIN
   puntos_venta PV ON U.punto_venta = PV.id_puntos_venta
       INNER JOIN
   zonas Z ON PV.id_zonas = Z.id_zonas
       INNER JOIN
   regiones R ON Z.id_regiones = R.id_regiones
   WHERE U.id_usuarios > 4447
   ORDER BY id_usuarios ASC;
;
   `;

  const data1 = await db_query(querySQL1)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      next(err);
    });

  const data2 = await db_query(querySQL2)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      next(err);
    });

    req.body = { rows: total.concat(data1, data2) };
    next();

};
