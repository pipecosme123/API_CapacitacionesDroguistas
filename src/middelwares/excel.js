const xl = require("excel4node");

exports.excel = (req, res, next) => {
  const { rows } = req.body;

  const fecha = new Date();

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("Datos Generales");

  const filename = `./src/uploads/Reporte - Capacitación Droguistas - ${fecha.getDate()}-${
    meses[fecha.getMonth()]
  }-${fecha.getFullYear()}.xlsx`;

  const rosaBoldStyle = wb.createStyle({
    font: {
      bold: true,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      fgColor: "#fce4d6",
    },
    alignment: {
      // §18.8.1
      horizontal: "center",
      vertical: "center",
    },
  });

  const azulBoldStyle = wb.createStyle({
    font: {
      bold: true,
    },
    fill: {
      type: "pattern", // the only one implemented so far.
      patternType: "solid", // most common.
      fgColor: "ddebf7",
    },
    alignment: {
      // §18.8.1
      horizontal: "center",
      vertical: "center",
    },
  });

  const visto = wb.createStyle({
    font: {
      color: "4472c4",
      bold: true,
    },
    fill: {
      type: "pattern", // the only one implemented so far.
      patternType: "solid", // most common.
      fgColor: "ddebf7",
    },
    alignment: {
      // §18.8.1
      horizontal: "center",
    },
  });

  const normal = wb.createStyle({
    alignment: {
      // §18.8.1
      horizontal: "center",
    },
  });

  const isVisto = (value) => {
    if (value === "Visto") {
      return visto;
    } else {
      return normal;
    }
  };

  ws.column(1).setWidth(6);
  ws.column(2).setWidth(60);
  ws.column(3).setWidth(12);
  ws.column(4).setWidth(6);
  ws.column(5).setWidth(22);
  ws.column(6).setWidth(22);
  ws.column(7).setWidth(19);
  ws.column(8).setWidth(19);
  ws.column(9).setWidth(19);
  ws.column(10).setWidth(19);
  ws.column(11).setWidth(19);
  ws.column(12).setWidth(19);
  ws.column(13).setWidth(19);

  // Definir encabezados de las columnas

  ws.cell(1, 1, 2, 1, true).string("ID").style(rosaBoldStyle);
  ws.cell(1, 2, 2, 2, true).string("Correos").style(rosaBoldStyle);
  ws.cell(1, 3, 2, 3, true).string("Distribuidores").style(rosaBoldStyle);
  ws.cell(1, 4, 2, 4, true).string("OCC").style(rosaBoldStyle);
  ws.cell(1, 5, 2, 5, true).string("Regiones").style(rosaBoldStyle);
  ws.cell(1, 6, 2, 6, true).string("Zonas").style(rosaBoldStyle);
  ws.cell(1, 7, 2, 7, true).string("Puntos de Venta").style(rosaBoldStyle);
  ws.cell(1, 8, 2, 8, true).string("Celular").style(rosaBoldStyle);
  ws.cell(1, 9, 2, 9, true).string("Códigos").style(rosaBoldStyle);
  ws.cell(1, 10, 2, 10, true).string("Fecha Registro").style(rosaBoldStyle);
  ws.cell(1, 11, 1, 16, true)
    .string("Visualización de Videos")
    .style(azulBoldStyle);
  ws.cell(2, 11).string("Colgate Total Charcoal").style(azulBoldStyle);
  ws.cell(2, 12).string("Colgate Línea Gard").style(azulBoldStyle);
  ws.cell(2, 13).string("Colgate Plax Odor Control").style(azulBoldStyle);
  ws.cell(2, 14).string("Colgate Sensitive Pro Relief").style(azulBoldStyle);
  ws.cell(2, 15)
    .string("Speed Stick y Lady Speed Stick Clinical Complete")
    .style(azulBoldStyle);
  ws.cell(2, 16).string("Lady Speed Stick Hair Minimizer").style(azulBoldStyle);

  // Hacer la consulta a la base de datos y obtener la respuesta
  // Supongamos que la respuesta está en la variable 'rows'
  // ...

  // Recorrer los resultados y agregarlos al archivo de Excel
  rows.forEach((row, index) => {
    ws.cell(index + 3, 1).number(index + 1);
    ws.cell(index + 3, 2).string(row.correo);
    ws.cell(index + 3, 3).string(row.distribuidores);
    ws.cell(index + 3, 4).string(row.occ);
    ws.cell(index + 3, 5).string(row.regiones);
    ws.cell(index + 3, 6).string(row.zonas);
    ws.cell(index + 3, 7).string(row.puntos_venta);
    ws.cell(index + 3, 8).string(row.celular);
    ws.cell(index + 3, 9).string(`${row.codigo}`);
    // ws.cell(index + 3, 10).string(`${row.fechaRegistro}`);
    ws.cell(index + 3, 10)
      .date(row.fechaRegistro)
      .style({ numberFormat: "dd-mm-yyyy hh:mm:ss" });
    ws.cell(index + 3, 11)
      .string(row.producto1)
      .style(isVisto(row.producto1));
    ws.cell(index + 3, 12)
      .string(row.producto2)
      .style(isVisto(row.producto2));
    ws.cell(index + 3, 13)
      .string(row.producto3)
      .style(isVisto(row.producto3));
    ws.cell(index + 3, 14)
      .string(row.producto4)
      .style(isVisto(row.producto4));
    ws.cell(index + 3, 15)
      .string(row.producto5)
      .style(isVisto(row.producto5));
    ws.cell(index + 3, 16)
      .string(row.producto6)
      .style(isVisto(row.producto6));
  });

  wb.write(filename, (err, buffer) => {
    if (err) {
      next(err);
    }
    // Descargar el archivo Excel en el navegador
    res.download(filename);
    // req.body = { filename }
    // next();
  });
};
