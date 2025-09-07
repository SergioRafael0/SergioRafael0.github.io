document.addEventListener("DOMContentLoaded", () => {
  let eventos = JSON.parse(localStorage.getItem("eventos")) || []
  let productos = JSON.parse(localStorage.getItem("productos")) || []
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  let stats = { productos: 0, usuarios: 0, ventas: 0, ingresos: 0 }

  function guardarEventos() {
    localStorage.setItem("eventos", JSON.stringify(eventos))
  }

  function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos))
    actualizarStats()
  }

  function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    actualizarStats()
  }

  function actualizarStats() {
    stats.productos = productos.length
    stats.usuarios = usuarios.length
    document.getElementById("productosStat").textContent = stats.productos
    document.getElementById("usuariosStat").textContent = stats.usuarios
    document.getElementById("ventasStat").textContent = stats.ventas
    document.getElementById("ingresosStat").textContent = `$${stats.ingresos.toLocaleString("es-CL")}`
  }

  function renderEventos() {
    const tbody = document.querySelector("#tablaEventos tbody")
    tbody.innerHTML = ""
    eventos.forEach((e, i) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td><span class="badge bg-${e.tipo}">${e.label}</span></td>
        <td>${e.nombre}</td>
        <td>${e.fecha}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarEvento(${i})">X</button></td>
      `
      tbody.appendChild(tr)
    })
  }

  function renderProductos() {
    const tbody = document.querySelector("#tablaProductos tbody")
    tbody.innerHTML = ""
    productos.forEach((p, i) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>$${p.precio.toLocaleString("es-CL")}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarProducto(${i})">✎</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})">X</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  }

  function renderUsuarios() {
    const tbody = document.querySelector("#tablaUsuarios tbody")
    tbody.innerHTML = ""
    usuarios.forEach((u, i) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.password}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarUsuario(${i})">✎</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${i})">X</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  }

  document.getElementById("formEvento").addEventListener("submit", e => {
    e.preventDefault()
    const tipo = document.getElementById("tipo").value
    const label = document.querySelector(`#tipo option[value="${tipo}"]`).dataset.label
    const nombre = document.getElementById("evento").value
    const fecha = document.getElementById("fecha").value
    eventos.push({ tipo, label, nombre, fecha })
    guardarEventos()
    renderEventos()
    e.target.reset()
  })

  document.getElementById("formProducto").addEventListener("submit", e => {
    e.preventDefault()
    const nombre = document.getElementById("productoNombre").value
    const precio = parseFloat(document.getElementById("productoPrecio").value)
    const index = document.getElementById("productoIndex").value
    if (index === "") {
      productos.push({ nombre, precio })
    } else {
      productos[index] = { nombre, precio }
      document.getElementById("productoIndex").value = ""
    }
    guardarProductos()
    renderProductos()
    e.target.reset()
  })

  document.getElementById("formUsuario").addEventListener("submit", e => {
    e.preventDefault()
    const nombre = document.getElementById("usuarioNombre").value
    const email = document.getElementById("usuarioEmail").value
    const password = document.getElementById("usuarioPassword").value
    const index = document.getElementById("usuarioIndex").value
    if (index === "") {
      usuarios.push({ nombre, email, password })
    } else {
      usuarios[index] = { nombre, email, password }
      document.getElementById("usuarioIndex").value = ""
    }
    guardarUsuarios()
    renderUsuarios()
    e.target.reset()
  })

  window.eliminarEvento = function (i) {
    eventos.splice(i, 1)
    guardarEventos()
    renderEventos()
  }

  window.eliminarProducto = function (i) {
    productos.splice(i, 1)
    guardarProductos()
    renderProductos()
  }

  window.eliminarUsuario = function (i) {
    usuarios.splice(i, 1)
    guardarUsuarios()
    renderUsuarios()
  }

  window.editarProducto = function (i) {
    const p = productos[i]
    document.getElementById("productoNombre").value = p.nombre
    document.getElementById("productoPrecio").value = p.precio
    document.getElementById("productoIndex").value = i
  }

  window.editarUsuario = function (i) {
    const u = usuarios[i]
    document.getElementById("usuarioNombre").value = u.nombre
    document.getElementById("usuarioEmail").value = u.email
    document.getElementById("usuarioPassword").value = u.password
    document.getElementById("usuarioIndex").value = i
  }

  document.getElementById("buscarEvento").addEventListener("input", e => {
    const term = e.target.value.toLowerCase()
    document.querySelectorAll("#tablaEventos tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none"
    })
  })

  document.getElementById("buscarProducto").addEventListener("input", e => {
    const term = e.target.value.toLowerCase()
    document.querySelectorAll("#tablaProductos tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none"
    })
  })

  document.getElementById("buscarUsuario").addEventListener("input", e => {
    const term = e.target.value.toLowerCase()
    document.querySelectorAll("#tablaUsuarios tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none"
    })
  })

  renderEventos()
  renderProductos()
  renderUsuarios()
  actualizarStats()

  async function cargarNoticias() {
    const apiKey = "8f29952f5bdfb2ecad809e1b61148a85";
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
})
