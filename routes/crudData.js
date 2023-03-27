const express = require('express');
const pool = require('../database/database.js');
const app = express();

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.post('/Login', (req, res) => {

    const { inputCorreo } = req.body;

    const queryLogin = 'SELECT idUsuarios AS idU FROM Usuarios WHERE correoUsuarios=?;'
    const queryData = 'SELECT * FROM DatosGenerales WHERE correoUsuarios=?;'


    pool.getConnection((err, connection) => {

        if (err) throw err;

        let registrado = new Promise((resolve) => {
            connection.query(queryLogin, [inputCorreo.toLowerCase()], (err, row, fields) => {
                if (err) throw err;
                let cant = row[0] ? parseInt(row[0].idU) : 0;
                resolve(cant)
            })
        })

        if (registrado !== 0) {
            let data = new Promise((resolve) => {
                connection.query(queryData, [inputCorreo.toLowerCase()], (err, row, fields) => {
                    if (err) throw err;
                    res.send(row);
                    connection.release();
                })
            })
        } else {
            res.send('undefined');
            connection.release();
        }

    })
});

app.post('/Registrarse', (req, res) => {

    const {
        correo,
        distribuidor,
        region,
        celular,
        codigo
    } = req.body;

    const querySelect = 'SELECT count(idUsuarios) AS Cantidad FROM Usuarios WHERE correoUsuarios=?;'
    const queryInsert = 'INSERT INTO Usuarios VALUES (NULL,?,?,?,?,?,NULL);';

    pool.getConnection((err, connection) => {

        if (err) throw err;

        let registrado = new Promise((resolve) => {
            connection.query(querySelect, [correo.toLowerCase()], (err, row, fields) => {
                if (err) throw err;
                resolve(parseInt(row[0].Cantidad));
            })
        })

        if (registrado === 0) {
            connection.query(queryInsert, [correo.toLowerCase(), distribuidor, region, celular, codigo], (err, row, fields) => {
                if (err) throw err;
                res.send(true);
                connection.release();
            })
        } else {
            res.send("existe");
            connection.release();
        }

    })
});

app.get('/getAllRegistros', (req, res) => {

    const query = 'SELECT * FROM DatosGenerales;';

    pool.getConnection((err, connection) => {

        if (err) throw err;

        connection.query(query, (err, row, fields) => {
            if (err) throw err;

            res.send(row);
            connection.release();
        })
    });
});

app.get('/:id', (req, res) => {

    const { id } = req.params;
    const query = 'SELECT * FROM DatosGenerales WHERE idUsuarios=?;';

    pool.getConnection((err, connection) => {

        if (err) throw err;

        connection.query(query, [id], (err, row, fields) => {

            if (err) throw err;

            res.json(row);
            connection.release();

        })
    })
});

app.post('/ViewCapacitacion', (req, res) => {

    const { idUsuario, idProducto } = req.body;

    const querySearch = 'SELECT count(idCapacitaciones) AS Cantidad FROM Capacitaciones WHERE fkUsuarios=? AND fkProductoColgate=?;';
    const queryInsert = 'INSERT INTO Capacitaciones VALUES (NULL,?,?,NULL);';

    pool.getConnection((err, connection) => {

        if (err) throw err;

        let resultado = new Promise((resolve) => {
            connection.query(querySearch, [idUsuario, idProducto], (err, row, fields) => {

                if (err) throw err;
                resolve(parseInt(row[0].Cantidad));
            })
        })

        if (resultado === 0) {
            connection.query(queryInsert, [idUsuario, idProducto], (err, row, fields) => {
                if (err) throw err;

                res.json(row);
                connection.release();
            })
        } else {
            res.send("OK!")
            connection.release();
        }
    })
});

app.post('/Quiz', (req, res) => {

    const { idUsuario, idOpcionRespuesta } = req.body;

    const querySearch = 'SELECT count(idQuices) AS Cantidad FROM Quices WHERE fkUsuario=? AND fkOpcionRespuesta=?;';
    const queryInsert = 'INSERT INTO Quices VALUES (NULL,?,?,NULL);';

    pool.getConnection((err, connection) => {

        if (err) throw err;

        let resultado = new Promise((resolve) => {
            connection.query(querySearch, [idUsuario, idOpcionRespuesta], (err, row, fields) => {
                if (err) throw err;
                resolve(parseInt(row[0].Cantidad));
            })
        })

        if (resultado === 0) {
            connection.query(queryInsert, [idUsuario, idOpcionRespuesta], (err, row, fields) => {
                if (err) throw err;

                res.json(row);
                connection.release();
            })
        } else {
            res.send("OK!")
            connection.release();
        }
    })
});

app.get('/materialDescargable/:name', (req, res) => {

    const { name } = req.params;
    res.download(__dirname + '/files/' + name, name, (err) => {
        if (err) throw err;
        console.log(true);
    });

})

app.post('/changeData', (req, res) => {

    const {
        idUsuarios,
        correoUsuarios,
        distribuidorUsuarios,
        regionUsuarios,
        celularUsuarios
    } = req.body;

    const queryInsert = `UPDATE Usuarios SET correoUsuarios = ?, distribuidorUsuarios = ?, regionUsuarios = ?, celularUsuarios = ? WHERE (idUsuarios = ?);`;

    pool.getConnection((err, connection) => {

        if (err) throw err;

        connection.query(queryInsert, [correoUsuarios.toLowerCase(), distribuidorUsuarios, regionUsuarios, celularUsuarios, idUsuarios], (err, row, fields) => {
            if (err) throw err;
            res.send(true);
            connection.release();
        })
    })
})


app.delete('/delete/:id', (req, res) => {

    const { id } = req.params;
    // console.log(id); eliminarRegistro(5)
    const query = `CALL eliminarRegistro(?)`;

    pool.getConnection((err, connection) => {

        if (err) throw err;

        connection.query(query, [id], (err, row, fields) => {
            if (err) throw err;

            res.send(true);
            connection.release();
        })
    })
})

module.exports = app;