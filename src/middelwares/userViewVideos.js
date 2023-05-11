exports.userViewVideos = async (req, res, next) => {
   const {
      productos,
      viewVideo
   } = req.body;

   viewVideo.map(video => {
      const index = productos.findIndex(producto => producto.id === video.id_productos);
      productos[index].visto = true;
   });

   res.send(productos)
}