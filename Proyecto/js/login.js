document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const inputUsuario = document.getElementById("exampleInputEmail1");
  const inputPassword = document.getElementById("exampleInputPassword1");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inputUsuario.value === "Admin" && inputPassword.value === "ContraseñaSegura123!") {
      const adminUser = { nombre: "Admin", email: "admin@system.local" };
      localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));
      window.location.href = "desarrollador.html";
    } else {
      const normalUser = { nombre: inputUsuario.value, email: inputUsuario.value };
      localStorage.setItem("usuarioActivo", JSON.stringify(normalUser));
      window.location.href = "/web/index.html";
    }
  });
});
