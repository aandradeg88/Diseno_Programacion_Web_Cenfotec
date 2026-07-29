const formCarrera = document.getElementById('formCarrera');

const inputCodigo = document.getElementById('codigo');
const inputNombreCarrera = document.getElementById('nombre-carrera');
const inputDuracion = document.getElementById('duracion');
const selectModalidad = document.getElementById('modalidad');

const errorCodigo = document.getElementById('errorCodigo');
const errorNombreCarrera = document.getElementById('errorNombreCarrera');
const errorDuracion = document.getElementById('errorDuracion');
const errorModalidad = document.getElementById('errorModalidad');

const mensajeConfirmacionCarrera = document.getElementById('mensajeConfirmacionCarrera');
const cuerpoTablaCarreras = document.getElementById('cuerpoTablaCarreras');
const indiceEdicionCarrera = document.getElementById('indiceEdicionCarrera');
const botonGuardarCarrera = document.getElementById('botonGuardarCarrera');

// Expresiones regulares para validar el formato de cada campo
const regexCodigo = /^[A-Za-z]{2,5}-[0-9]{2}$/;
const regexNombreCarrera = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,80}$/;

formCarrera.addEventListener('submit', function (evento) {
  evento.preventDefault();

  limpiarErroresCarrera();

  const codigo = inputCodigo.value.trim();
  const nombreCarrera = inputNombreCarrera.value.trim();
  const duracion = inputDuracion.value.trim();
  const modalidad = selectModalidad.value;

  let formularioValido = true;

  if (codigo === '') {
    mostrarErrorCarrera(inputCodigo, errorCodigo, 'El código es obligatorio.');
    formularioValido = false;
  } else if (!regexCodigo.test(codigo)) {
    mostrarErrorCarrera(inputCodigo, errorCodigo, 'Formato esperado: ISW-01.');
    formularioValido = false;
  }

  if (nombreCarrera === '') {
    mostrarErrorCarrera(inputNombreCarrera, errorNombreCarrera, 'El nombre es obligatorio.');
    formularioValido = false;
  } else if (!regexNombreCarrera.test(nombreCarrera)) {
    mostrarErrorCarrera(inputNombreCarrera, errorNombreCarrera, 'Ingrese un nombre válido (solo letras).');
    formularioValido = false;
  }

  if (duracion === '') {
    mostrarErrorCarrera(inputDuracion, errorDuracion, 'La duración es obligatoria.');
    formularioValido = false;
  } else if (duracion < 1 || duracion > 6) {
    mostrarErrorCarrera(inputDuracion, errorDuracion, 'La duración debe estar entre 1 y 6 años.');
    formularioValido = false;
  }

  if (modalidad === '') {
    mostrarErrorCarrera(selectModalidad, errorModalidad, 'Debe seleccionar una modalidad.');
    formularioValido = false;
  }

  if (!formularioValido) {
    mensajeConfirmacionCarrera.classList.add('oculto');
    return;
  }

  const nuevaCarrera = {
    codigo: codigo,
    nombre: nombreCarrera,
    duracion: duracion,
    modalidad: modalidad
  };

  guardarCarreraEnLocalStorage(nuevaCarrera);

  formCarrera.reset();
  indiceEdicionCarrera.value = '';
  botonGuardarCarrera.textContent = 'Guardar carrera';

  mensajeConfirmacionCarrera.classList.remove('oculto');
});

function guardarCarreraEnLocalStorage(carrera) {
  const carrerasGuardadas = localStorage.getItem('carreras');
  const listaCarreras = carrerasGuardadas ? JSON.parse(carrerasGuardadas) : [];

  if (indiceEdicionCarrera.value === '') {
    // Es una carrera nueva
    listaCarreras.push(carrera);
  } else {
    // Estamos editando una existente
    const indice = parseInt(indiceEdicionCarrera.value);
    listaCarreras[indice] = carrera;
  }

  localStorage.setItem('carreras', JSON.stringify(listaCarreras));

  console.log('Lista de carreras registradas:', listaCarreras);

  mostrarCarreras();
}

function mostrarErrorCarrera(campo, elementoError, mensaje) {
  campo.classList.add('invalido');
  elementoError.textContent = mensaje;
}

function limpiarErroresCarrera() {
  const campos = document.querySelectorAll('#formCarrera .campo input, #formCarrera .campo select');
  const errores = document.querySelectorAll('#formCarrera .error');

  campos.forEach(function (campo) {
    campo.classList.remove('invalido');
  });

  errores.forEach(function (error) {
    error.textContent = '';
  });
}

function obtenerNombreModalidad(valor) {
  if (valor === 'presencial') {
    return 'Presencial';
  } else if (valor === 'virtual') {
    return 'Virtual';
  } else if (valor === 'hibrida') {
    return 'Híbrida';
  } else {
    return valor;
  }
}

function mostrarCarreras() {
  const carrerasGuardadas = localStorage.getItem('carreras');
  const listaCarreras = carrerasGuardadas ? JSON.parse(carrerasGuardadas) : [];

  cuerpoTablaCarreras.innerHTML = '';

  listaCarreras.forEach(function (carrera, indice) {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${carrera.codigo}</td>
      <td>${carrera.nombre}</td>
      <td>${carrera.duracion}</td>
      <td>${obtenerNombreModalidad(carrera.modalidad)}</td>
      <td>
        <button type="button" onclick="editarCarrera(${indice})">Editar</button>
        <button type="button" onclick="eliminarCarrera(${indice})">Eliminar</button>
      </td>
    `;

    cuerpoTablaCarreras.appendChild(fila);
  });
}

function editarCarrera(indice) {
  const carrerasGuardadas = localStorage.getItem('carreras');
  const listaCarreras = carrerasGuardadas ? JSON.parse(carrerasGuardadas) : [];
  const carrera = listaCarreras[indice];

  inputCodigo.value = carrera.codigo;
  inputNombreCarrera.value = carrera.nombre;
  inputDuracion.value = carrera.duracion;
  selectModalidad.value = carrera.modalidad;

  indiceEdicionCarrera.value = indice;
  botonGuardarCarrera.textContent = 'Actualizar carrera';

  formCarrera.scrollIntoView({ behavior: 'smooth' });
}

function eliminarCarrera(indice) {
  const confirmar = confirm('¿Está seguro de que desea eliminar esta carrera?');

  if (!confirmar) {
    return;
  }

  const carrerasGuardadas = localStorage.getItem('carreras');
  const listaCarreras = carrerasGuardadas ? JSON.parse(carrerasGuardadas) : [];

  listaCarreras.splice(indice, 1);

  localStorage.setItem('carreras', JSON.stringify(listaCarreras));

  mostrarCarreras();
}

mostrarCarreras();