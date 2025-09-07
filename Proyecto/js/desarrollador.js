document.addEventListener("DOMContentLoaded", () => {
  const stats = {
    productos: 120,
    usuarios: 85,
    ventas: 34,
    ingresos: 540000
  };

  document.getElementById("productosStat").textContent = stats.productos;
  document.getElementById("usuariosStat").textContent = stats.usuarios;
  document.getElementById("ventasStat").textContent = stats.ventas;
  document.getElementById("ingresosStat").textContent = `$${stats.ingresos.toLocaleString("es-CL")}`;

  const tablaEventos = document.querySelector("#tablaEventos tbody");
  const formEvento = document.getElementById("formEvento");
  const mensajeEvento = document.getElementById("mensajeEvento");
  const buscarEvento = document.getElementById("buscarEvento");

  let eventos = [
    { tipo: "primary", nombre: "Reunión con proveedores", fecha: "2025-09-10" },
    { tipo: "success", nombre: "Lanzamiento nuevo juego", fecha: "2025-09-15" },
    { tipo: "info", nombre: "Capacitación en línea", fecha: "2025-09-20" },
    { tipo: "danger", nombre: "Inventario mensual", fecha: "2025-09-25" }
  ];

  function renderEventos(lista) {
    tablaEventos.innerHTML = "";
    lista.forEach(e => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="badge bg-${e.tipo}">${e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1)}</span></td>
        <td>${e.nombre}</td>
        <td>${e.fecha}</td>
      `;
      tablaEventos.appendChild(row);
    });
  }

  renderEventos(eventos);

  formEvento.addEventListener("submit", e => {
    e.preventDefault();
    const tipo = document.getElementById("tipo").value;
    const nombre = document.getElementById("evento").value;
    const fecha = document.getElementById("fecha").value;

    if (nombre && fecha) {
      eventos.push({ tipo, nombre, fecha });
      renderEventos(eventos);
      mensajeEvento.classList.remove("d-none");
      setTimeout(() => mensajeEvento.classList.add("d-none"), 2000);
      formEvento.reset();
    }
  });

  buscarEvento.addEventListener("input", e => {
    const filtro = e.target.value.toLowerCase();
    const filtrados = eventos.filter(ev => ev.nombre.toLowerCase().includes(filtro));
    renderEventos(filtrados);
  });

  async function cargarNoticias() {
    const apiKey = "7ff83a6ae84dcd94bbc3287b0cf977c4";
    const url = `https://gnews.io/api/v4/search?q=gaming&lang=es&max=10&token=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const newsContainer = document.getElementById("gamingNews");
      newsContainer.innerHTML = "";
      data.articles.forEach(noticia => {
        const card = document.createElement("div");
        card.className = "card shadow-sm";
        card.style.width = "250px";
        card.style.flex = "0 0 auto";
        card.innerHTML = `
          <img src="${noticia.image || 'https://via.placeholder.com/250x140'}" class="card-img-top" style="height:140px; object-fit:cover;">
          <div class="card-body p-2">
            <h6 class="card-title" style="font-size:0.9rem; white-space:normal;">${noticia.title}</h6>
            <a href="${noticia.url}" target="_blank" class="btn btn-primary btn-sm mt-2">Ver más</a>
          </div>
        `;
        newsContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando noticias", error);
    }
  }

  cargarNoticias();
});
