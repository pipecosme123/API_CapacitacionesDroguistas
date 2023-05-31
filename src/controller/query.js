const { query } = require("../config/database");

exports.get_login = async (req, res, next) => {

   const { correo } = req.body;

   const querySQL = 'SELECT id_usuarios AS id, distribuidor, punto_venta, occ, correo, celular, codigo FROM users WHERE correo= ? LIMIT 1;';

   query(querySQL, correo)
      .then((data) => {
         req.body = { data };
         next();
      }).catch((err) => {
         next(err);
      });
}

exports.get_distribuidores = (req, res, next) => {

   const querySQL_distribuidores = 'SELECT id_distribuidores AS id, distribuidores FROM distribuidores ORDER BY distribuidores ASC;';

   query(querySQL_distribuidores)
      .then((data) => {
         res.send(data);
      }).catch((err) => {
         next(err);
      });
}

exports.get_regiones = (req, res, next) => {

   const querySQL = 'SELECT id_regiones AS id, regiones FROM regiones;';

   query(querySQL)
      .then((data) => {
         res.send(data)
      }).catch((err) => {
         next(err);
      });

}

exports.get_zonas = (req, res, next) => {

   const { id } = req.query;

   const querySQL = 'SELECT id_zonas AS id, zonas FROM zonas WHERE id_regiones = ? ORDER BY zonas ASC;';

   query(querySQL, id)
      .then((data) => {
         res.send(data)
      }).catch((err) => {
         next(err);
      });
}

exports.get_pv = (req, res, next) => {

   const { id } = req.query;

   const querySQL = 'SELECT id_puntos_venta AS id, puntos_venta AS pv FROM puntos_venta WHERE id_zonas = ?;';

   query(querySQL, id)
      .then((data) => {
         res.send(data)
      }).catch((err) => {
         next(err);
      });
}

exports.get_user_productos = async (req, res, next) => {

   const { usuario } = req.authData;

   const querySQL_SelectProductos = 'SELECT id_productos AS id, nombre_productos AS nombre, imagenes_productos AS imagenes FROM productos;';

   const querySQL_SelectViewVideos = 'SELECT id_productos FROM capacitaciones WHERE id_usuarios = ?;'

   const productos = await query(querySQL_SelectProductos).then((data) => {
      return data;
   }).catch((err) => {
      next(err);
   });

   const viewVideo = await query(querySQL_SelectViewVideos, usuario.id).then((data) => {
      return data;
   }).catch((err) => {
      next(err);
   });

   req.body = {
      productos,
      viewVideo
   }

   next();
}

exports.get_producto = async (req, res, next) => {

   const { id } = req.query;

   const querySQL_SelectProductos = 'SELECT id_productos AS id, nombre_productos AS nombre, videos_productos AS video, texto_videos_productos AS texto, pdf_productos AS pdf FROM productos WHERE id_productos = ?;';

   const producto = await query(querySQL_SelectProductos, id).then((data) => {
      return data[0];
   }).catch((err) => {
      next(err);
   });

   req.body = {
      producto
   }

   next();
}

exports.get_data_signup = async (req, res, next) => {

   const query_select_droguerias = 'SELECT id_droguerias AS id, droguerias AS drogueria FROM droguerias;';
   const query_select_regiones = 'SELECT z.id_zonas AS id, r.regiones, z.zonas AS zona FROM zonas z LEFT JOIN regiones r ON r.id_regiones = z.id_regiones;';

   const select_droguerias = await query(query_select_droguerias)
      .then((data) => {
         return data;
      }).catch((err) => {
         next(err);
      });

   const select_regiones = await query(query_select_regiones)
      .then((data) => {
         return data;
      }).catch((err) => {
         next(err);
      });

   req.body = {
      droguerias: select_droguerias,
      regiones: select_regiones,
   }

   next();
}

exports.post_registrase = (req, res, next) => {

   const {
      distribuidor,
      pv,
      occ,
      correo,
      celular,
      codigo,
   } = req.body;

   const querySQL_Select = 'SELECT count(id_usuarios) AS cantidad FROM users WHERE correo = ?;'

   query(querySQL_Select, correo)
      .then((data) => {

         if (data[0].cantidad === 0) {

            const querySQL_Insert = 'INSERT INTO users (distribuidor, punto_venta, occ, correo, celular, codigo) VALUES (?, ?, ?, ?, ?, ?);';
            const data_QuerySQL_Insert = [
               distribuidor,
               pv,
               occ,
               correo,
               celular,
               codigo,
            ];

            query(querySQL_Insert, data_QuerySQL_Insert)
               .then(() => {
                  res.send('Registro añadido correctamente');
               }).catch((err) => {
                  next(err);
               });

         } else {
            res.status(400).send(`El correo electrónico '${correo}', ya se encuentra registrado en la base de datos.`)
         }

      }).catch((err) => {
         next(err);
      });

}

exports.post_visto_video = async (req, res, next) => {

   const { usuario } = req.authData;
   const { id } = req.query;

   const querySQL = 'INSERT INTO capacitaciones (id_usuarios, id_productos) VALUES (?, ?);';
   const dataQuery = [usuario.id, id]

   query(querySQL, dataQuery)
      .then((data) => {
         console.log(data);
         res.send('¡Felicitaciones! Has completado esta lección.');
      }).catch((err) => {
         next(err);
      });

}