// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function(){
  // Pone el año actual en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú hamburguesa para móvil
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mainNav.setAttribute('aria-expanded', String(!expanded));
    });
    // Cierra el menú si hago click fuera en móvil
    document.addEventListener('click', function(e){
      if(window.innerWidth <= 720){
        if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
          hamburger.setAttribute('aria-expanded', 'false');
          mainNav.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Carrusel de productos destacados (solo si existe)
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let current = 0;
    let autoplay = true;
    let autoplayInterval = 4500;
    let timer = null;

    // Cambia de slide
    function goTo(index){
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      dots.forEach((d,i)=> d.setAttribute('aria-selected', i===index ? 'true' : 'false'));
      current = index;
    }
    // Siguiente slide
    function next(){ goTo((current+1) % slides.length); }
    // Slide anterior
    function prev(){ goTo((current-1 + slides.length) % slides.length); }
    if (nextBtn) nextBtn.addEventListener('click', function(){ next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', function(){ prev(); resetTimer(); });
    dots.forEach(dot => dot.addEventListener('click', function(){
      const idx = Number(this.dataset.slide);
      goTo(idx); resetTimer();
    }));
    // Autoplay del carrusel
    function startTimer(){ if(autoplay) timer = setInterval(next, autoplayInterval); }
    function stopTimer(){ if(timer) clearInterval(timer); }
    function resetTimer(){ stopTimer(); startTimer(); }
    goTo(0); startTimer();
    // Pausa autoplay al pasar el mouse
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    // Imagen de respaldo si falla la carga
    carousel.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.src = 'https://picsum.photos/seed/fallback/800/450';
      });
    });
  }

  // Scroll suave para los enlaces internos
  const scrollLinks = [
    {selector:'a[href="#destacados"]', target:'destacados'},
    {selector:'a[href="#nosotros"]', target:'nosotros'},
    {selector:'a[href="#contacto"]', target:'contacto'}
  ];
  scrollLinks.forEach(link => {
    const el = document.querySelector(link.selector);
    const targetEl = document.getElementById(link.target);
    if (el && targetEl) {
      el.addEventListener('click', function(e){
        e.preventDefault();
        targetEl.scrollIntoView({behavior: 'smooth'});
      });
    }
  });

  // Efecto hover en las tarjetas de producto
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
  });

  // ==== Carrito ====
  // Obtiene el carrito del localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem('gg_cart') || '[]');
  }
  // Guarda el carrito en localStorage
  function setCart(cart) {
    localStorage.setItem('gg_cart', JSON.stringify(cart));
  }
  // Actualiza el contador del carrito en menú y footer
  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.querySelectorAll('#cart-count, #cart-count-footer').forEach(el => {
      if (el) el.textContent = count;
    });
  }

  // Botón "Agregar" suma productos al carrito
  document.querySelectorAll('.agregar-carrito').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const card = btn.closest('.product-card');
      if (!card) return;
      const title = card.querySelector('h3').textContent;
      const priceText = card.querySelector('.price').textContent.replace(/[^0-9]/g, '');
      const price = Number(priceText);
      const desc = card.querySelector('.desc').textContent;
      const img = card.querySelector('img').src;
      const id = (title + desc).replace(/\s+/g, '-').toLowerCase();
      let cart = getCart();
      let item = cart.find(i => i.id === id);
      if (item) {
        item.qty += 1;
      } else {
        cart.push({ id, title, price, desc, img, qty: 1 });
      }
      setCart(cart);
      updateCartCount();
      btn.textContent = "Agregado!";
      setTimeout(() => btn.textContent = "Agregar", 1200);
    });
  });

  updateCartCount();

  // Si estoy en carrito.html, muestro el carrito y manejo eliminar/finalizar
  if (window.location.pathname.includes('carrito.html')) {
    function renderCart() {
      const cart = getCart();
      const list = document.getElementById('cart-items');
      const empty = document.getElementById('cart-empty');
      const totalEl = document.getElementById('cart-total');
      list.innerHTML = '';
      let total = 0;
      if (cart.length === 0) {
        if (empty) empty.style.display = 'block';
        if (totalEl) totalEl.textContent = '';
        return;
      }
      if (empty) empty.style.display = 'none';
      cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-desc">${item.desc}</div>
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            <div class="cart-item-qty">Cantidad: ${item.qty}</div>
          </div>
          <button class="cart-remove-btn" data-id="${item.id}">Eliminar</button>
        `;
        list.appendChild(li);
      });
      if (totalEl) totalEl.textContent = `Total: $${total.toLocaleString()}`;
      list.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = btn.getAttribute('data-id');
          let cart = getCart();
          cart = cart.filter(i => i.id !== id);
          setCart(cart);
          renderCart();
          updateCartCount();
        });
      });
    }
    renderCart();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        if (getCart().length === 0) return;
        alert('¡Gracias por tu compra!');
        setCart([]);
        renderCart();
        updateCartCount();
      });
    }
  }

  // ==== Formulario de contacto ====
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  if (form && successEl) {
    // Muestra errores debajo de cada campo
    function showError(fieldName, message){
      const el = document.querySelector(`.error[data-for="${fieldName}"]`);
      if(el) el.textContent = message || '';
    }
    // Valida los campos del formulario
    function validate(){
      let valid = true;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.mensaje.value.trim();
      const terms = form.terms.checked;
      if(name.length < 2){ showError('name','Ingresa un nombre válido (mín 2 letras)'); valid = false; } else showError('name','');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){ showError('email','Ingresa un email válido'); valid = false; } else showError('email','');
      if(msg.length < 8){ showError('mensaje','Escribe un mensaje más detallado (mín 8 caracteres)'); valid = false; } else showError('mensaje','');
      if(!terms){ showError('terms','Debes aceptar ser contactado'); valid = false; } else showError('terms','');
      return valid;
    }
    // Envía el formulario si todo está OK
    form.addEventListener('submit', function(e){
      e.preventDefault();
      successEl.textContent = '';
      const submitBtn = form.querySelector('button[type="submit"]');
      if(validate()){
        successEl.textContent = 'Gracias — tu mensaje ha sido enviado.';
        form.reset();
        document.querySelectorAll('.error').forEach(el=>el.textContent='');
        submitBtn.textContent = "Mensaje enviado";
        setTimeout(() => submitBtn.textContent = "Enviar", 2000);
      } else {
        successEl.textContent = '';
      }
    });
    // Valida en tiempo real al salir de cada campo
    form.querySelectorAll('input,textarea').forEach(inp => {
      inp.addEventListener('blur', function(){ validate(); });
    });
  }
});
