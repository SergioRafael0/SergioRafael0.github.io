function validarCorreo(correo) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function validarPassword(pass) {
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
  return regex.test(pass);
}

var form = document.getElementById('registroForm');
var correo = document.getElementById('correo');
var pass = document.getElementById('password');
var confirmar = document.getElementById('confirmar');
var mensaje = document.getElementById('registro');
var passwordHelp = document.getElementById('passwordHelp');

// Validación en vivo de la contraseña
pass.addEventListener("input", function () {
  if (validarPassword(pass.value)) {
    passwordHelp.classList.add('d-none'); // Ocultar reglas
    pass.classList.remove('is-invalid');
  } else {
    passwordHelp.classList.remove('d-none'); // Mostrar reglas
  }
});

// Evento submit del formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  var valido = true;

  // Validar correo
  if (!validarCorreo(correo.value)) {
    correo.classList.add('is-invalid');
    valido = false;
  } else {
    correo.classList.remove('is-invalid');
  }

  // Validar contraseña
  if (!validarPassword(pass.value)) {
    pass.classList.add('is-invalid');
    passwordHelp.classList.remove('d-none');
    valido = false;
  } else {
    pass.classList.remove('is-invalid');
    passwordHelp.classList.add('d-none');
  }

  // Validar confirmación
  if (pass.value !== confirmar.value || confirmar.value === "") {
    confirmar.classList.add('is-invalid');
    valido = false;
  } else {
    confirmar.classList.remove('is-invalid');
  }

  if (valido) {
    mensaje.textContent = "Registrado exitosamente. Redirigiendo...";
    mensaje.classList.remove("text-danger");
    mensaje.classList.add("text-success", "fw-bold");

    form.reset();
    passwordHelp.classList.add('d-none');

    setTimeout(function () {
      window.location.href = "login.html";
    }, 3000);

  } else {
    mensaje.textContent = "Datos inválidos. Vuelve a intentarlo.";
    mensaje.classList.remove("text-success");
    mensaje.classList.add("text-danger", "fw-bold");

    correo.value = "";
    pass.value = "";
    confirmar.value = "";
    correo.focus();
  }
});