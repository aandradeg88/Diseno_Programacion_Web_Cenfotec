const URL_API_EGRESADOS = 'http://localhost:3000/egresados';

const formEgresado = document.getElementById('formEgresado');

const inputIdentificacion = document.getElementById('identificacion');
const inputNombreCompleto = document.getElementById('nombreCompleto');
const inputCorreo = document.getElementById('correoElectronico');
const inputTelefono = document.getElementById('telefono');
const inputFechaRegistro = document.getElementById('fechaRegistro');

const errorIdentificacion = document.getElementById('errorIdentificacion');
const errorNombreCompleto = document.getElementById('errorNombreCompleto');
const errorCorreo = document.getElementById('errorCorreo');
const errorTelefono = document.getElementById('errorTelefono');
const errorFecha = document.getElementById('errorFecha');

const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
const mensajeError = document.getElementById('mensajeError');
const cuerpoTablaEgresados = document.getElementById('cuerpoTablaEgresados');
const botonGuardar = document.getElementById('botonGuardar');

const regexIdentificacion = /^[0-9]{9,10}$/;
const regexNombreCompleto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^[0-9]{4}-[0-9]{4}$/;

formEgresado.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  limpiarErrores();
  ocultarMensajes();

  const identificacion = inputIdentificacion.value.trim();
  const nombreCompleto = inputNombreCompleto.value.trim();
  const correoElectronico = inputCorreo.value.trim();
  const telefono = inputTelefono.value.trim();
  const fechaRegistro = inputFechaRegistro.value;

  let formularioValido = true;

  if (identificacion === '') {
    mostrarError(inputIdentificacion, errorIdentificacion, 'La identificación es obligatoria.');
    formularioValido = false;
  } else if (!regexIdentificacion.test(identificacion)) {
    mostrarError(inputIdentificacion, errorIdentificacion, 'La identificación debe tener 9 o 10 dígitos.');
    formularioValido = false;
  }

  if (nombreCompleto === '') {
    mostrarError(inputNombreCompleto, errorNombreCompleto, 'El nombre es obligatorio.');
    formularioValido = false;
  } else if (!regexNombreCompleto.test(nombreCompleto)) {
    mostrarError(inputNombreCompleto, errorNombreCompleto, 'Ingrese un nombre válido (solo letras).');
    formularioValido = false;
  }

  if (correoElectronico === '') {
    mostrarError(inputCorreo, errorCorreo, 'El correo es obligatorio.');
    formularioValido = false;
  } else if (!regexCorreo.test(correoElectronico)) {
    mostrarError(inputCorreo, errorCorreo, 'Ingrese un correo con formato válido.');
    formularioValido = false;
  }

  if (telefono === '') {
    mostrarError(inputTelefono, errorTelefono, 'El teléfono es obligatorio.');
    formularioValido = false;
  } else if (!regexTelefono.test(telefono)) {
    mostrarError(inputTelefono, errorTelefono, 'Formato esperado: 8888-8888.');
    formularioValido = false;
  }

  if (fechaRegistro === '') {
    mostrarError(inputFechaRegistro, errorFecha, 'La fecha de registro es obligatoria.');
    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  const nuevoEgresado = {
    identificacion: identificacion,
    nombreCompleto: nombreCompleto,
    correoElectronico: correoElectronico,
    telefono: telefono,
    fechaRegistro: fechaRegistro
  };

  await guardarEgresado(nuevoEgresado);
});

async function guardarEgresado(egresado) {
  try {
    const respuesta = await fetch(URL_API_EGRESADOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(egresado)
    });

    if (!respuesta.ok) {
      throw new Error('El servidor respondió con un error al guardar el egresado.');
    }

    formEgresado.reset();
    mensajeConfirmacion.classList.remove('oculto');

    await consultarEgresados();
  } catch (error) {
    console.error('Error al guardar el egresado:', error);
    mensajeError.classList.remove('oculto');
  }
}

async function consultarEgresados() {
  try {
    const respuesta = await fetch(URL_API_EGRESADOS);

    if (!respuesta.ok) {
      throw new Error('El servidor respondió con un error al consultar los egresados.');
    }

    const listaEgresados = await respuesta.json();
    mostrarEgresados(listaEgresados);
  } catch (error) {
    console.error('Error al consultar los egresados:', error);
    mensajeError.classList.remove('oculto');
  }
}

function mostrarError(campo, elementoError, mensaje) {
  campo.classList.add('invalido');
  elementoError.textContent = mensaje;
}

function limpiarErrores() {
  const campos = document.querySelectorAll('#formEgresado .campo input');
  const errores = document.querySelectorAll('#formEgresado .error');

  campos.forEach(function (campo) {
    campo.classList.remove('invalido');
  });

  errores.forEach(function (error) {
    error.textContent = '';
  });
}

function ocultarMensajes() {
  mensajeConfirmacion.classList.add('oculto');
  mensajeError.classList.add('oculto');
}

function mostrarEgresados(listaEgresados) {
  cuerpoTablaEgresados.innerHTML = '';

  listaEgresados.forEach(function (egresado) {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${egresado.identificacion}</td>
      <td>${egresado.nombreCompleto}</td>
      <td>${egresado.correoElectronico}</td>
      <td>${egresado.telefono}</td>
      <td>${formatearFecha(egresado.fechaRegistro)}</td>
    `;

    cuerpoTablaEgresados.appendChild(fila);
  });
}

function formatearFecha(fechaISO) {
  if (!fechaISO) {
    return '';
  }
  return fechaISO.substring(0, 10);
}

consultarEgresados();

// Comentario agregado para documentar el codigo