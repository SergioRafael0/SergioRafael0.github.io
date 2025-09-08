function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/.test(pass);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const usuario = document.getElementById("usuario");
  const correo = document.getElementById("correo");
  const pass = document.getElementById("password");
  const confirmar = document.getElementById("confirmar");
  const mensaje = document.getElementById("registro");
  const passwordHelp = document.getElementById("passwordHelp");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;

    // Validar correo
    if (!validarCorreo(correo.value)) {
      correo.classList.add("is-invalid");
      valido = false;
    } else {
      correo.classList.remove("is-invalid");
    }

    // Validar password
    if (!validarPassword(pass.value)) {
      pass.classList.add("is-invalid");
      passwordHelp.classList.remove("d-none");
      valido = false;
    } else {
      pass.classList.remove("is-invalid");
      passwordHelp.classList.add("d-none");
    }

    // Confirmación
    if (pass.value !== confirmar.value || confirmar.value === "") {
      confirmar.classList.add("is-invalid");
      valido = false;
    } else {
      confirmar.classList.remove("is-invalid");
    }

    if (valido) {
      // Guardar usuario en localStorage
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push({
        nombre: usuario.value,
        email: correo.value,
        password: pass.value,
      });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      mensaje.textContent = "Registrado exitosamente. Redirigiendo...";
      mensaje.classList.remove("text-danger");
      mensaje.classList.add("text-success", "fw-bold");

      form.reset();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      mensaje.textContent = "Datos inválidos. Vuelve a intentarlo.";
      mensaje.classList.remove("text-success");
      mensaje.classList.add("text-danger", "fw-bold");
    }
  });
});
