export const parseCrasaInvoice = (text) => {
  const normalizeText = (str) => {
    return str.replace(/\s+/g, " ").trim();
  };

  const pedidoMatch = text.match(/Pedido\s+No\s*(\d+)/i);
  const fechaMatch = text.match(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}/);

  const pedidoNo = pedidoMatch ? pedidoMatch[1] : null;
  const fecha = fechaMatch ? fechaMatch[1] : null;

  const productos = [];
  const palabrasProhibidas = [
    "INFORMACION BANCARIA",
    "Tipo de moneda",
    "Serie",
    "RFC",
    "Referencia",
    "Folio",
    "Uso del",
    "UUID",
  ];

  const regexProhibido = new RegExp(`^(${palabrasProhibidas.join("|")})`, "i");
  const lineas = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];

    // Patrón: C8207 - PRONTO GELATINA MIX 24X84G
    const patron1 = linea.match(/^C?(\d{3,7})\s*-\s*(.+)$/);
    if (patron1) {
      const codigo = patron1[1];
      let descripcion = patron1[2].trim();

      // Construir descripción completa
      let j = i + 1;
      while (j < lineas.length) {
        const siguienteLinea = lineas[j];
        if (
          siguienteLinea.match(/^\d+%$/) ||
          siguienteLinea.match(/^[\d,]+\.\d+$/) ||
          siguienteLinea.match(/^[\d.]+\s+Kg$/) ||
          siguienteLinea.match(/^\d{8}$/) ||
          siguienteLinea === "Caj XBX" ||
          siguienteLinea.match(/^C?\d{3,7}/) ||
          siguienteLinea.includes("Obj. Imp:")
        ) {
          break;
        }
        if (siguienteLinea && siguienteLinea !== "-") {
          descripcion += " " + siguienteLinea;
        }
        j++;
        if (j > i + 3) break;
      }

      descripcion = descripcion
        .replace(/\s*0%.*$/, "")
        .replace(/\s*[\d,]+\.\d+.*$/, "")
        .replace(/\s*\d+\.\d+\s+Kg.*$/, "")
        .replace(/\s*\d{8}.*$/, "")
        .trim();

      const cantidad = buscarCantidad(lineas, i);

      if (
        !descripcion ||
        /^\d/.test(descripcion) ||
        regexProhibido.test(descripcion)
      ) {
        continue;
      }

      productos.push({
        codigo: codigo,
        descripcion: normalizeText(descripcion),
        cantidad: cantidad,
      });
      continue;
    }

    // Patrón: C8207 (código solo)
    const patron2 = linea.match(/^C?(\d{3,7})$/);
    if (patron2) {
      const codigo = patron2[1];
      const descripcion = construirDescripcion(lineas, i + 1);
      const cantidad = buscarCantidad(lineas, i);

      if (
        !descripcion ||
        /^\d/.test(descripcion) ||
        regexProhibido.test(descripcion)
      ) {
        continue;
      }

      productos.push({
        codigo: codigo,
        descripcion: normalizeText(descripcion),
        cantidad: cantidad,
      });
    }
  }

  function construirDescripcion(lineas, indiceInicio) {
    const partes = [];
    for (
      let j = indiceInicio;
      j < Math.min(indiceInicio + 10, lineas.length);
      j++
    ) {
      const lineaDesc = lineas[j];
      if (
        lineaDesc.match(/^\d+%$/) ||
        lineaDesc.match(/^[\d,]+\.\d+$/) ||
        lineaDesc.match(/^[\d.]+\s+Kg$/) ||
        lineaDesc.match(/^\d{8}$/) ||
        lineaDesc === "Caj XBX" ||
        lineaDesc.match(/^C\d{4,5}/) ||
        lineaDesc.includes("Obj. Imp:")
      ) {
        break;
      }
      if (lineaDesc && lineaDesc !== "-") {
        partes.push(lineaDesc);
      }
    }
    return partes.join(" ");
  }

  function buscarCantidad(lineas, indiceProducto) {
    for (
      let k = indiceProducto;
      k < Math.min(indiceProducto + 20, lineas.length - 1);
      k++
    ) {
      if (lineas[k] === "Caj XBX") {
        const siguienteLinea = lineas[k + 1];
        if (siguienteLinea && siguienteLinea.match(/^\d+$/)) {
          return parseInt(siguienteLinea);
        }
      }
    }
    return 0;
  }

  const productosUnicos = productos
    .filter(
      (producto, index, self) =>
        index === self.findIndex((p) => p.codigo === producto.codigo)
    )
    .sort((a, b) => a.codigo - b.codigo);

  const cantidadTotal = productosUnicos.reduce((sum, p) => sum + p.cantidad, 0);

  return {
    pedidoNo,
    fecha,
    cantidadProductos: productosUnicos.length,
    cantidadTotal,
    productos: productosUnicos,
  };
};
