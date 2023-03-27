const express = require('express');
const morgan = require('morgan');
const path = require('path');
const xl = require('excel4node');
const pool = require('../database/database.js');
const res = require('express/lib/response');
const app = express();

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


app.get('/getAllRegistros', (req, res) => {

    const query = 'SELECT * FROM DatosGenerales;';

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, row, fields) => {
            if (err) throw err;
            res.send(row);
            connection.release();
        })
    })

});

app.get('/downloadExcel', async (req, res) => {

    const query = 'SELECT * FROM DatosGenerales WHERE idUsuarios > 121;';

    let rowData = await new Promise((resolve) => {

        pool.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(query, (err, row, fields) => {
                if (err) throw err;
                resolve(row);
                connection.release();
            })
        })
    })

    let fileNameExcel = `Reporte - Capacitación a Droguistas - ${obtenerFechaActual()}.xlsx`;

    let createExcel = await exportExcel(rowData, fileNameExcel);

    if (createExcel) {
        res.download(__dirname + '/excel/' + fileNameExcel, fileNameExcel, (err) => {
            if (err) throw err;
            console.log("descargado");
        });
    }
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


const exportExcel = async (data, fileName) => {

    let wb = new xl.Workbook({
        defaultFont: {
            size: 12,
            name: 'Calibri',
            color: '#333333',
        },
        dateFormat: 'm/d/yy hh:mm:ss'
    });

    let styleDatos = wb.createStyle({
        font: {
            color: "#333333",
            size: 12
        }
    })

    let styleCabeceraDatos = wb.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true
        },
        alignment: { // §18.8.1
            horizontal: 'center',
            vertical: 'center'
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "fce4d6"
        },
        border: {
            left: {
                style: "thin",
                color: "#808080"
            },
            right: {
                style: "thin",
                color: "#808080"
            },
            top: {
                style: "thin",
                color: "#808080"
            },
            bottom: {
                style: "thin",
                color: "#808080"
            }
        }
    })

    let styleCabeceraVideos = wb.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true
        },
        alignment: { // §18.8.1
            horizontal: 'center',
            vertical: 'center'
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "ddebf7"
        },
        border: {
            left: {
                style: "thin",
                color: "#808080"
            },
            right: {
                style: "thin",
                color: "#808080"
            },
            top: {
                style: "thin",
                color: "#808080"
            },
            bottom: {
                style: "thin",
                color: "#808080"
            }
        }
    })

    let styleSiVideos = wb.createStyle({
        font: {
            color: "#4472c4",
            size: 12,
            bold: true
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "ddebf7"
        },
        alignment: {
            horizontal: 'center'
        }
    })

    let styleNoVideos = wb.createStyle({
        font: {
            color: "#000000",
            size: 12,
        },
        alignment: {
            horizontal: 'center'
        }
    })

    let styleCabeceraQuiz = wb.createStyle({
        font: {
            color: "#000000",
            size: 12,
            bold: true
        },
        alignment: { // §18.8.1
            horizontal: 'center',
            vertical: 'center'
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "fff2cc"
        },
        border: {
            left: {
                style: "thin",
                color: "#808080"
            },
            right: {
                style: "thin",
                color: "#808080"
            },
            top: {
                style: "thin",
                color: "#808080"
            },
            bottom: {
                style: "thin",
                color: "#808080"
            }
        }
    })

    let styleRespuestaCorrecta = wb.createStyle({
        font: {
            color: "#006100",
            size: 12
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "c6efce"
        }
    })

    let styleRespuestaIncorrecta = wb.createStyle({
        font: {
            color: "#9c0006",
            size: 12
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: "ffc7ce"
        }
    })

    const tipoStyleVideos = (tipo) => {
        if (tipo === 'SI') {
            return styleSiVideos;
        } else {
            return styleNoVideos;
        }
    }

    const tipoStyle = (tipo) => {
        if (tipo === 'true') {
            return styleRespuestaCorrecta;
        } else if (tipo === 'false') {
            return styleRespuestaIncorrecta;
        } else {
            return styleDatos;
        }
    }

    // ------------ DATOS GENERALES ------------ \\

    let dg = wb.addWorksheet('Datos Generales');

    dg.cell(1, 1, 3, 1, true).string("#").style(styleCabeceraDatos);
    dg.cell(1, 2, 3, 2, true).string("Correo Electrónico").style(styleCabeceraDatos);
    dg.cell(1, 3, 3, 3, true).string("Distribuidor").style(styleCabeceraDatos);
    dg.cell(1, 4, 3, 4, true).string("Región Zonal").style(styleCabeceraDatos);
    dg.cell(1, 5, 3, 5, true).string("Código IPV ACF").style(styleCabeceraDatos);
    dg.cell(1, 6, 3, 6, true).string("Celular").style(styleCabeceraDatos);
    dg.cell(1, 7, 3, 7, true).string("Fecha de registro").style(styleCabeceraDatos);
    // --------------- VIDEOS --------------- \\
    dg.cell(1, 8, 2, 12, true).string("Visualización de Videos").style(styleCabeceraVideos);
    dg.cell(3, 8).string("Sensitive").style(styleCabeceraVideos);
    dg.cell(3, 9).string("PerioGard").style(styleCabeceraVideos);
    dg.cell(3, 10).string("OrthoGard").style(styleCabeceraVideos);
    dg.cell(3, 11).string("Total 12").style(styleCabeceraVideos);
    dg.cell(3, 12).string("Luminous White").style(styleCabeceraVideos);
    // --------------- QUIZ --------------- \\
    dg.cell(1, 13, 1, 27, true).string("Respuestas - Quiz").style(styleCabeceraQuiz);

    dg.cell(2, 13, 2, 15, true).string("Sensitive Pro-Alivio").style(styleCabeceraQuiz);
    dg.cell(3, 13).string("Pregunta 1").style(styleCabeceraQuiz);
    dg.cell(3, 14).string("Pregunta 2").style(styleCabeceraQuiz);
    dg.cell(3, 15).string("Pregunta 3").style(styleCabeceraQuiz);

    dg.cell(2, 16, 2, 18, true).string("PerioGard").style(styleCabeceraQuiz);
    dg.cell(3, 16).string("Pregunta 1").style(styleCabeceraQuiz);
    dg.cell(3, 17).string("Pregunta 2").style(styleCabeceraQuiz);
    dg.cell(3, 18).string("Pregunta 3").style(styleCabeceraQuiz);

    dg.cell(2, 19, 2, 21, true).string("OrthoGard").style(styleCabeceraQuiz);
    dg.cell(3, 19).string("Pregunta 1").style(styleCabeceraQuiz);
    dg.cell(3, 20).string("Pregunta 2").style(styleCabeceraQuiz);
    dg.cell(3, 21).string("Pregunta 3").style(styleCabeceraQuiz);

    dg.cell(2, 22, 2, 24, true).string("Total 12").style(styleCabeceraQuiz);
    dg.cell(3, 22).string("Pregunta 1").style(styleCabeceraQuiz);
    dg.cell(3, 23).string("Pregunta 2").style(styleCabeceraQuiz);
    dg.cell(3, 24).string("Pregunta 3").style(styleCabeceraQuiz);

    dg.cell(2, 25, 2, 27, true).string("Luminous White").style(styleCabeceraQuiz);
    dg.cell(3, 25).string("Pregunta 1").style(styleCabeceraQuiz);
    dg.cell(3, 26).string("Pregunta 2").style(styleCabeceraQuiz);
    dg.cell(3, 27).string("Pregunta 3").style(styleCabeceraQuiz);

    console.log(data.length);

    for (let i = 0; i < data.length; i++) {

        let numCelda = 4 + i;
        let datos = data[i];
        let fecha = formatoFecha(datos.fechaRegistro);
        // console.log(fecha, typeof fecha)

        dg.cell(numCelda, 1).number(numCelda - 3).style({ alignment: { horizontal: 'center' } });
        dg.cell(numCelda, 2).string(datos.correoUsuarios);
        dg.cell(numCelda, 3).string(datos.distribuidorUsuarios);
        dg.cell(numCelda, 4).string(datos.regionUsuarios);
        dg.cell(numCelda, 5).string(`${datos.codigoDrogueria !== null ? datos.codigoDrogueria : ""}`);
        dg.cell(numCelda, 6).string(`${datos.celularUsuarios}`);
        dg.cell(numCelda, 7).string(`${fecha}`);
        // --------------- VIDEOS --------------- \\
        dg.cell(numCelda, 8).string(datos.SensitiveProAlivio).style(tipoStyleVideos(datos.SensitiveProAlivio));
        dg.cell(numCelda, 9).string(datos.Periogard).style(tipoStyleVideos(datos.Periogard));
        dg.cell(numCelda, 10).string(datos.Orthogard).style(tipoStyleVideos(datos.Orthogard));
        dg.cell(numCelda, 11).string(datos.Total12).style(tipoStyleVideos(datos.Total12));
        dg.cell(numCelda, 12).string(datos.LuminousWhite).style(tipoStyleVideos(datos.LuminousWhite));

        // --------------- QUIZ --------------- \\
        dg.cell(numCelda, 13).string(datos.Pregunta1_SensitiveProAlivio).style(tipoStyle(datos.Pregunta1Tipo_SensitiveProAlivio));
        dg.cell(numCelda, 14).string(datos.Pregunta2_SensitiveProAlivio).style(tipoStyle(datos.Pregunta2Tipo_SensitiveProAlivio));
        dg.cell(numCelda, 15).string(datos.Pregunta3_SensitiveProAlivio).style(tipoStyle(datos.Pregunta3Tipo_SensitiveProAlivio));

        dg.cell(numCelda, 16).string(datos.Pregunta1_Periogard).style(tipoStyle(datos.Pregunta1Tipo_Periogard));
        dg.cell(numCelda, 17).string(datos.Pregunta2_Periogard).style(tipoStyle(datos.Pregunta2Tipo_Periogard));
        dg.cell(numCelda, 18).string(datos.Pregunta3_Periogard).style(tipoStyle(datos.Pregunta3Tipo_Periogard));

        dg.cell(numCelda, 19).string(datos.Pregunta1_Orthogard).style(tipoStyle(datos.Pregunta1Tipo_Orthogard));
        dg.cell(numCelda, 20).string(datos.Pregunta2_Orthogard).style(tipoStyle(datos.Pregunta2Tipo_Orthogard));
        dg.cell(numCelda, 21).string(datos.Pregunta3_Orthogard).style(tipoStyle(datos.Pregunta3Tipo_Orthogard));

        dg.cell(numCelda, 22).string(datos.Pregunta1_Total12).style(tipoStyle(datos.Pregunta1Tipo_Total12));
        dg.cell(numCelda, 23).string(datos.Pregunta2_Total12).style(tipoStyle(datos.Pregunta2Tipo_Total12));
        dg.cell(numCelda, 24).string(datos.Pregunta3_Total12).style(tipoStyle(datos.Pregunta3Tipo_Total12));

        dg.cell(numCelda, 25).string(datos.Pregunta1_LuminousWhite).style(tipoStyle(datos.Pregunta1Tipo_LuminousWhite));
        dg.cell(numCelda, 26).string(datos.Pregunta2_LuminousWhite).style(tipoStyle(datos.Pregunta2Tipo_LuminousWhite));
        dg.cell(numCelda, 27).string(datos.Pregunta3_LuminousWhite).style(tipoStyle(datos.Pregunta3Tipo_LuminousWhite));

    }

    dg.column(1).setWidth(6);
    dg.column(2).setWidth(35);
    dg.column(3).setWidth(13);
    dg.column(4).setWidth(40);
    dg.column(5).setWidth(13);
    dg.column(6).setWidth(18);
    dg.column(7).setWidth(22);
    dg.column(8).setWidth(15);
    dg.column(9).setWidth(15);
    dg.column(10).setWidth(15);
    dg.column(11).setWidth(15);
    dg.column(12).setWidth(15);

    console.log('exel');

    const nameFilePath = path.join(__dirname, 'excel', fileName);

    let writeFile = await new Promise((resolve) => {

        wb.write(nameFilePath, function (err, stats) {
            if (err) throw err;
            resolve(true);
        });
    })

    return writeFile;
}

const formatoFecha = (data) => {

    let fecha = new Date(data);

    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    let result = fecha.getDate() + "-" + (months[fecha.getMonth()]) + "-" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    return result;
}

const obtenerFechaActual = () => {
    let fecha = new Date();

    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    let result = fecha.getDate() + "_" + (months[fecha.getMonth()]) + "_" + fecha.getFullYear();
    return result;
}

module.exports = app;