document.addEventListener("DOMContentLoaded", () => {
    const stats = {
        productos: 128,
        usuarios: 54,
        ventas: 23,
        ingresos: 85000
    };

    document.getElementById("productosStat").textContent = stats.productos;
    document.getElementById("usuariosStat").textContent = stats.usuarios;
    document.getElementById("ventasStat").textContent = stats.ventas;
    document.getElementById("ingresosStat").textContent = `$${stats.ingresos.toLocaleString()}`;

    let eventos = JSON.parse(localStorage.getItem("eventos")) || [
        { tipo: "primary", texto: "Reunión de equipo", fecha: "2024-10-10" },
        { tipo: "success", texto: "Lanzamiento colección verano", fecha: "2024-10-15" },
        { tipo: "info", texto: "Capacitación en ventas", fecha: "2024-10-20" },
        { tipo: "danger", texto: "Revisión de inventario", fecha: "2024-10-28" },
        { tipo: "warning", texto: "Auditoría interna", fecha: "2024-11-05" }
    ];

    const tablaEventos = document.querySelector("#tablaEventos tbody");

    function getTipoNombre(tipo) {
        switch (tipo) {
            case "primary": return "Reunión";
            case "success": return "Lanzamiento";
            case "info": return "Capacitación";
            case "danger": return "Inventario";
            case "warning": return "Auditoría";
            default: return "Evento";
        }
    }

    function renderEventos(filtro = "") {
        tablaEventos.innerHTML = "";
        eventos
            .filter(ev => ev.texto.toLowerCase().includes(filtro.toLowerCase()))
            .forEach(ev => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><span class="badge bg-${ev.tipo}">${getTipoNombre(ev.tipo)}</span></td>
                    <td>${ev.texto}</td>
                    <td>${ev.fecha}</td>
                `;
                tablaEventos.appendChild(tr);
            });
    }

    renderEventos();

    document.getElementById("buscarEvento").addEventListener("input", e => {
        renderEventos(e.target.value);
    });

    document.getElementById("formEvento").addEventListener("submit", e => {
        e.preventDefault();
        const tipo = document.getElementById("tipo").value;
        const texto = document.getElementById("evento").value;
        const fecha = document.getElementById("fecha").value;

        eventos.push({ tipo, texto, fecha });
        localStorage.setItem("eventos", JSON.stringify(eventos));
        renderEventos();
        e.target.reset();

        const msg = document.getElementById("mensajeEvento");
        msg.classList.remove("d-none");
        setTimeout(() => msg.classList.add("d-none"), 2000);
    });

    async function cargarNoticias() {
        const apiKey = "4b87bf9cd055545da6916f7b3eef4b56";
        const url = `https://gnews.io/api/v4/search?q=gaming&lang=es&max=10&token=${apiKey}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            const container = document.getElementById("gamingNews");
            container.innerHTML = "";

            data.articles.forEach(article => {
                const card = document.createElement("div");
                card.className = "card news-card shadow-sm";

                card.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <div class="card-body">
                        <h6 class="card-title">${article.title}</h6>
                        <p class="card-text small text-muted">${article.source.name}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-sm btn-primary">Leer más</a>
                    </div>
                `;

                container.appendChild(card);
            });
        } catch (err) {
            console.error("Error cargando noticias:", err);
            document.getElementById("gamingNews").innerHTML =
                "<div class='text-danger'>Error cargando noticias</div>";
        }
    }

    document.getElementById("refreshNews").addEventListener("click", () => {
        const container = document.getElementById("gamingNews");
        container.innerHTML = "<div>Actualizando noticias...</div>";
        cargarNoticias();
    });

    cargarNoticias();
});
