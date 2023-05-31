const express = require('express');
const { get_login, post_visto_video, get_user_productos, post_registrase, get_producto, get_data_signup, get_zonas, get_pv, get_distribuidores, get_regiones } = require('../controller/query');
const { capacitacion_producto } = require('../middelwares/capacitacion_producto');
const { getDataAuth } = require('../middelwares/getDataAuth');
const { validateDataUsers, organice_data } = require('../middelwares/loginUsers');
const { verificarToken } = require('../middelwares/token');
const { userViewVideos } = require('../middelwares/userViewVideos');

const app = express();

app.get('/login', getDataAuth, get_login, validateDataUsers);
app.get('/distribuidores', get_distribuidores);
app.get('/regiones', get_regiones);
app.get('/zonas', get_zonas);
app.get('/pv', get_pv);
app.get('/signup', get_data_signup, organice_data);
app.get('/productos', verificarToken, get_user_productos, userViewVideos);
app.get('/producto', verificarToken, get_producto, capacitacion_producto);

app.post('/signup', post_registrase);
app.post('/viewVideo', verificarToken, post_visto_video);

module.exports = app;