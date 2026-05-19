// app.js

// =========================
// EVENTOS MANUALES
// =========================

const eventos = [

  {
    titulo: "Campaña de Unidad",
    iglesia: "Catedral de Alabanza",
    fecha: "2026-05-25",
    hora: "19:00",
    tipo: "Campaña",
    descripcion: "Noche especial de unidad pastoral."
  },

  {
    titulo: "Vigilia Regional",
    iglesia: "Ministerio Renuevo",
    fecha: "2026-05-25",
    hora: "22:00",
    tipo: "Vigilia",
    descripcion: "Clamor por las familias."
  },

  {
    titulo: "Conferencia Pastoral",
    iglesia: "Iglesia Emanuel",
    fecha: "2026-05-28",
    hora: "18:30",
    tipo: "Conferencia",
    descripcion: "Encuentro de liderazgo cristiano."
  },

  {
    titulo: "Evangelismo en Plaza",
    iglesia: "Centro Cristiano Vida",
    fecha: "2026-06-02",
    hora: "16:00",
    tipo: "Evangelismo",
    descripcion: "Actividad evangelística abierta."
  }

];

// =========================

const calendario = document.getElementById('calendario');
const listaEventos = document.getElementById('listaEventos');

const totalEventos = document.getElementById('totalEventos');
const totalIglesias = document.getElementById('totalIglesias');
const eventosMes = document.getElementById('eventosMes');

const filtroIglesia = document.getElementById('filtroIglesia');
const busqueda = document.getElementById('busqueda');

const mesActualTexto = document.getElementById('mesActual');

const prevMes = document.getElementById('prevMes');
const nextMes = document.getElementById('nextMes');

let fechaActual = new Date();

let fechaSeleccionada = null;

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

// =========================
// RESUMEN
// =========================

function actualizarResumen(){

  totalEventos.textContent = eventos.length;

  const iglesias =
    [...new Set(eventos.map(e => e.iglesia))];

  totalIglesias.textContent = iglesias.length;

  const hoy = new Date();

  const mesActual = hoy.getMonth() + 1;

  const eventosDelMes = eventos.filter(e => {

    const mesEvento =
      new Date(e.fecha).getMonth() + 1;

    return mesEvento === mesActual;

  });

  eventosMes.textContent =
    eventosDelMes.length;

}

// =========================
// FILTRO IGLESIAS
// =========================

function actualizarFiltroIglesias(){

  const iglesias =
    [...new Set(eventos.map(e => e.iglesia))];

  iglesias.forEach(iglesia => {

    const option =
      document.createElement('option');

    option.value = iglesia;
    option.textContent = iglesia;

    filtroIglesia.appendChild(option);

  });

}

// =========================
// CALENDARIO
// =========================

function renderCalendario(){

  calendario.innerHTML = '';

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  mesActualTexto.textContent =
    `${meses[mes]} ${año}`;

  const primerDia =
    new Date(año, mes, 1).getDay();

  const ultimoDia =
    new Date(año, mes + 1, 0).getDate();

  const hoy = new Date();

  for(let i = 0; i < primerDia; i++){

    const vacio =
      document.createElement('div');

    vacio.className = 'dia vacio';

    calendario.appendChild(vacio);

  }

  for(let dia = 1; dia <= ultimoDia; dia++){

    const fechaStr =
      `${año}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    const div =
      document.createElement('div');

    div.className = 'dia';

    if(
      dia === hoy.getDate() &&
      mes === hoy.getMonth() &&
      año === hoy.getFullYear()
    ){
      div.classList.add('hoy');
    }

    if(fechaSeleccionada === fechaStr){
      div.classList.add('selected');
    }

    const eventosDia =
      eventos.filter(e => e.fecha === fechaStr);

    div.innerHTML = `
      <div class="numero-dia">${dia}</div>
    `;

    eventosDia.slice(0,3).forEach(evento => {

      div.innerHTML += `
        <div class="eventito">
          ${evento.hora} - ${evento.titulo}
        </div>
      `;

    });

    if(eventosDia.length > 3){

      div.innerHTML += `
        <div class="eventito">
          +${eventosDia.length - 3} más
        </div>
      `;

    }

    div.addEventListener('click', () => {

      fechaSeleccionada = fechaStr;

      renderCalendario();

      renderEventosPorFecha(fechaStr);

    });

    calendario.appendChild(div);

  }

}

// =========================
// EVENTOS
// =========================

function renderEventosPorFecha(fecha){

  listaEventos.innerHTML = '';

  const textoBusqueda =
    busqueda.value.toLowerCase();

  const iglesiaSeleccionada =
    filtroIglesia.value;

  const eventosFiltrados = eventos.filter(e => {

    const coincideFecha =
      e.fecha === fecha;

    const coincideBusqueda =
      e.titulo.toLowerCase().includes(textoBusqueda) ||
      e.descripcion.toLowerCase().includes(textoBusqueda);

    const coincideIglesia =
      iglesiaSeleccionada === 'todos' ||
      e.iglesia === iglesiaSeleccionada;

    return (
      coincideFecha &&
      coincideBusqueda &&
      coincideIglesia
    );

  });

  if(eventosFiltrados.length === 0){

    listaEventos.innerHTML =
      `<p>No hay actividades para este día.</p>`;

    return;

  }

  eventosFiltrados.forEach(evento => {

    const card =
      document.createElement('div');

    card.className = 'evento';

    card.innerHTML = `
      <div class="badge">${evento.tipo}</div>

      <h3>${evento.titulo}</h3>

      <p><strong>⛪ Iglesia:</strong> ${evento.iglesia}</p>

      <p><strong>🕒 Hora:</strong> ${evento.hora}</p>

      <p>${evento.descripcion}</p>
    `;

    listaEventos.appendChild(card);

  });

}

// =========================
// NAVEGACION MESES
// =========================

prevMes.addEventListener('click', () => {

  fechaActual.setMonth(
    fechaActual.getMonth() - 1
  );

  renderCalendario();

});

nextMes.addEventListener('click', () => {

  fechaActual.setMonth(
    fechaActual.getMonth() + 1
  );

  renderCalendario();

});

// =========================
// FILTROS
// =========================

busqueda.addEventListener('input', () => {

  if(fechaSeleccionada){
    renderEventosPorFecha(fechaSeleccionada);
  }

});

filtroIglesia.addEventListener('change', () => {

  if(fechaSeleccionada){
    renderEventosPorFecha(fechaSeleccionada);
  }

});

// =========================
// INICIO
// =========================

actualizarResumen();

actualizarFiltroIglesias();

renderCalendario();

const hoyStr =
  new Date().toISOString().split('T')[0];

fechaSeleccionada = hoyStr;

renderEventosPorFecha(hoyStr);