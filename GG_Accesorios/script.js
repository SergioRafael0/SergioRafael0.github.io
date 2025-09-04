/*
  script.js
  - Controla: menú hamburguesa, carrusel automático y manual, formulario con validación
  - Solo JS Vanilla (sin librerías)
*/

// ===== Helper: DOM ready =====
document.addEventListener('DOMContentLoaded', function(){
  // Header year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  hamburger.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    // Toggle visibility for small screens
    if(!expanded){
      mainNav.style.display = 'block';
    } else {
      mainNav.style.display = '';
    }
  });

  // ===== Carousel =====
  const carousel = document.getElementById('carousel');
  const slides = carousel.querySelectorAll('.slide');
  const dots = carousel.querySelectorAll('.dot');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  let current = 0;
  let autoplay = true;
  let autoplayInterval = 4500;
  let timer = null;

  function goTo(index){
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    // update aria-selected
    dots.forEach((d,i)=> d.setAttribute('aria-selected', i===index ? 'true' : 'false'));
    current = index;
  }

  function next(){
    goTo((current+1) % slides.length);
  }
  function prev(){
    goTo((current-1 + slides.length) % slides.length);
  }

  // Buttons
  nextBtn.addEventListener('click', function(){ next(); resetTimer(); });
  prevBtn.addEventListener('click', function(){ prev(); resetTimer(); });

  // Dot navigation
  dots.forEach(dot => dot.addEventListener('click', function(){
    const idx = Number(this.dataset.slide);
    goTo(idx);
    resetTimer();
  }));

  function startTimer(){
    if(autoplay) timer = setInterval(next, autoplayInterval);
  }
  function stopTimer(){ if(timer) clearInterval(timer); }
  function resetTimer(){ stopTimer(); startTimer(); }

  // start
  goTo(0);
  startTimer();

  // Pause autoplay on hover for better UX
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  // ===== Form validation =====
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');

  function showError(fieldName, message){
    const el = document.querySelector(`.error[data-for="${fieldName}"]`);
    if(el) el.textContent = message || '';
  }

  function validate(){
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.mensaje.value.trim();
    const terms = form.terms.checked;

    // name
    if(name.length < 2){ showError('name','Ingresa un nombre válido (mín 2 letras)'); valid = false; } else showError('name','');

    // email simple check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){ showError('email','Ingresa un email válido'); valid = false; } else showError('email','');

    // mensaje
    if(msg.length < 8){ showError('mensaje','Escribe un mensaje más detallado (mín 8 caracteres)'); valid = false; } else showError('mensaje','');

    // terms
    if(!terms){ showError('terms','Debes aceptar ser contactado'); valid = false; } else showError('terms','');

    return valid;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    successEl.textContent = '';
    if(validate()){
      // Aquí normalmente enviarías a un servidor. Simulamos éxito.
      successEl.textContent = 'Gracias — tu mensaje ha sido enviado.';
      form.reset();
      // Ocultar errores si existen
      document.querySelectorAll('.error').forEach(el=>el.textContent='');
    } else {
      successEl.textContent = '';
    }
  });

  // Validación en tiempo real (al salir del campo)
  form.querySelectorAll('input,textarea').forEach(inp => {
    inp.addEventListener('blur', function(){ validate(); });
  });

  // Small enhancement: add hover effect on product cards (JS only for progressive enhancement)
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
  });

  // ===== Fallback para imágenes rotas en el carrusel =====
  // Si alguna imagen no carga (404 o path incorrecto), reemplazamos por un placeholder.
  document.querySelectorAll('#carousel img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'https://picsum.photos/seed/fallback/800/450';
    });
  });

});
