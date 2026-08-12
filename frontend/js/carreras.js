const URL_API_CARRERAS = 'http://localhost:3000/carreras';

const formCarrera = document.getElementById('formCarrera');

const inputNombreCarrera = document.getElementById('nombreCarrera');
const inputDescripcionCarrera = document.getElementById('descripcionCarrera');

const errorNombreCarrera = document.getElementById('errorNombreCarrera');
const errorDescripcionCarrera = document.getElementById('errorDescripcionCarrera');

const mensajeConfirmacionCarrera = document.getElementById('mensajeConfirmacionCarrera');
const mensajeErrorCarrera = document.getElementById('mensajeErrorCarrera');
const cuerpoTablaCarreras = document.getElementById('cuerpoTablaCarreras');
const botonGuardarCarrera = document.getElementById('botonGuardarCarrera');

const regexNombreCarrera = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,80}$/;

formCarrera.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  limpiarErroresCarrera();
  ocultarMensajesCarrera();

  const nombre = inputNombreCarrera.value.trim();
  const descripcion = inputDescripcionCarrera.value.trim();

  let formularioValido = true;

  if (nombre === '') {
    mostrarErrorCarrera(inputNombreCarrera, errorNombreCarrera, 'El nombre es obligatorio.');
    formularioValido = false;
  } else if (!regexNombreCarrera.test(nombre)) {
    mostrarErrorCarrera(inputNombreCarrera, errorNombreCarrera, 'Ingrese un nombre válido (solo letras).');
    formularioValido = false;
  }

  if (descripcion === '') {
    mostrarErrorCarrera(inputDescripcionCarrera, errorDescripcionCarrera, 'La descripción es obligatoria.');
    formularioValido = false;
  } else if (descripcion.length < 10 || descripcion.length > 300) {
    mostrarErrorCarrera(inputDescripcionCarrera, errorDescripcionCarrera, 'La descripción debe tener entre 10 y 300 caracteres.');
    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  const nuevaCarrera = {
    nombre: nombre,
    descripcion: descripcion
  };

  await guardarCarrera(nuevaCarrera);
});

async function guardarCarrera(carrera) {
  try {
    const respuesta = await fetch(URL_API_CARRERAS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(carrera)
    });

    if (!respuesta.ok) {
      throw new Error('El servidor respondió con un error al guardar la carrera.');
    }

    formCarrera.reset();
    mensajeConfirmacionCarrera.classList.remove('oculto');

    await consultarCarreras();
  } catch (error) {
    console.error('Error al guardar la carrera:', error);
    mensajeErrorCarrera.classList.remove('oculto');
  }
}

async function consultarCarreras() {
  try {
    const respuesta = await fetch(URL_API_CARRERAS);

    if (!respuesta.ok) {
      throw new Error('El servidor respondió con un error al consultar las carreras.');
    }

    const listaCarreras = await respuesta.json();
    mostrarCarreras(listaCarreras);
  } catch (error) {
    console.error('Error al consultar las carreras:', error);
    mensajeErrorCarrera.classList.remove('oculto');
  }
}

function mostrarErrorCarrera(campo, elementoError, mensaje) {
  campo.classList.add('invalido');
  elementoError.textContent = mensaje;
}

function limpiarErroresCarrera() {
  const campos = document.querySelectorAll('#formCarrera .campo input, #formCarrera .campo textarea');
  const errores = document.querySelectorAll('#formCarrera .error');

  campos.forEach(function (campo) {
    campo.classList.remove('invalido');
  });

  errores.forEach(function (error) {
    error.textContent = '';
  });
}

function ocultarMensajesCarrera() {
  mensajeConfirmacionCarrera.classList.add('oculto');
  mensajeErrorCarrera.classList.add('oculto');
}

function mostrarCarreras(listaCarreras) {
  cuerpoTablaCarreras.innerHTML = '';

  listaCarreras.forEach(function (carrera) {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${carrera.nombre}</td>
      <td>${carrera.descripcion}</td>
    `;

    cuerpoTablaCarreras.appendChild(fila);
  });
}

consultarCarreras();
