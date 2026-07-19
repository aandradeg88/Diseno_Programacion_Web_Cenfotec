const formEgresado = document.getElementById('formEgresado');

const inputCarne = document.getElementById('carne');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo-egresado');
const selectCarrera = document.getElementById('carrera');
const inputAnio = document.getElementById('anio');

const errorCarne = document.getElementById('errorCarne');
const errorNombre = document.getElementById('errorNombre');
const errorCorreo = document.getElementById('errorCorreo');
const errorCarrera = document.getElementById('errorCarrera');
const errorAnio = document.getElementById('errorAnio');

const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');

// Expresiones regulares para validar el formato de cada campo
const regexCarne = /^[0-9]{10}$/;
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexAnio = /^20[0-2][0-9]$/;

formEgresado.addEventListener('submit', function (evento) {
  evento.preventDefault();

  limpiarErrores();

  const carne = inputCarne.value.trim();
  const nombre = inputNombre.value.trim();
  const correo = inputCorreo.value.trim();
  const carrera = selectCarrera.value;
  const anio = inputAnio.value.trim();

  let formularioValido = true;

  if (carne === '') {
    mostrarError(inputCarne, errorCarne, 'El carné es obligatorio.');
    formularioValido = false;
  } else if (!regexCarne.test(carne)) {
    mostrarError(inputCarne, errorCarne, 'El carné debe tener 10 dígitos.');
    formularioValido = false;
  }

  if (nombre === '') {
    mostrarError(inputNombre, errorNombre, 'El nombre es obligatorio.');
    formularioValido = false;
  } else if (!regexNombre.test(nombre)) {
    mostrarError(inputNombre, errorNombre, 'Ingrese un nombre válido (solo letras).');
    formularioValido = false;
  }

  if (correo === '') {
    mostrarError(inputCorreo, errorCorreo, 'El correo es obligatorio.');
    formularioValido = false;
  } else if (!regexCorreo.test(correo)) {
    mostrarError(inputCorreo, errorCorreo, 'Ingrese un correo con formato válido.');
    formularioValido = false;
  }

  if (carrera === '') {
    mostrarError(selectCarrera, errorCarrera, 'Debe seleccionar una carrera.');
    formularioValido = false;
  }

  if (anio === '') {
    mostrarError(inputAnio, errorAnio, 'El año de graduación es obligatorio.');
    formularioValido = false;
  } else if (!regexAnio.test(anio)) {
    mostrarError(inputAnio, errorAnio, 'Ingrese un año válido (2000-2029).');
    formularioValido = false;
  }

  if (!formularioValido) {
    mensajeConfirmacion.classList.add('oculto');
    return;
  }

  const nuevoEgresado = {
    carne: carne,
    nombre: nombre,
    correo: correo,
    carrera: carrera,
    anio: anio
  };

  guardarEnLocalStorage(nuevoEgresado);

  formEgresado.reset();

  mensajeConfirmacion.classList.remove('oculto');
});

function guardarEnLocalStorage(egresado) {
  const egresadosGuardados = localStorage.getItem('egresados');
  const listaEgresados = egresadosGuardados ? JSON.parse(egresadosGuardados) : [];

  listaEgresados.push(egresado);

  localStorage.setItem('egresados', JSON.stringify(listaEgresados));

  console.log('Lista de egresados registrados:', listaEgresados);
}

function mostrarError(campo, elementoError, mensaje) {
  campo.classList.add('invalido');
  elementoError.textContent = mensaje;
}

function limpiarErrores() {
  const campos = document.querySelectorAll('.campo input, .campo select');
  const errores = document.querySelectorAll('.error');

  campos.forEach(function (campo) {
    campo.classList.remove('invalido');
  });

  errores.forEach(function (error) {
    error.textContent = '';
  });
}