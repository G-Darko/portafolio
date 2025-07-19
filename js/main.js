const year = document.getElementById("year");
const date = new Date();
const thisYear = date.getFullYear();

year.innerText = thisYear;

function showModal(id) {
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.visibility = "visible";
    document.getElementById(id).classList.add('open');

    // Inicializar slider si es el modal del Portafolio
    if (id === 'Portafolio') {
        initializeSlider('Portafolio');
    }
}

function hideModal(id) {
    document.getElementById(id).style.opacity = 0;
    document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).classList.remove('open');
}

function responsive() {
    let nav = document.getElementById('nav');
    nav.classList.toggle('responsive');
}

function selected(link) {
    let opcion = document.querySelectorAll('#nav a');    
    opcion[0].className = "";
    opcion[1].className = "";
    opcion[2].className = "";

    link.className = "selected";

    let nav = document.getElementById('nav');
    nav.className = "";
}

// Lógica del Slider
function initializeSlider(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return; // Asegurarse de que el modal exista

    const sliderTrack = modal.querySelector('.slider-track');
    const sliderItems = modal.querySelectorAll('.slider-item');
    const prevBtn = modal.querySelector('.slider-nav.prev');
    const nextBtn = modal.querySelector('.slider-nav.next');
    const sliderDotsContainer = modal.querySelector('.slider-dots');

    // Verificar si todos los elementos del slider existen antes de continuar
    if (!sliderTrack || !sliderItems.length || !prevBtn || !nextBtn || !sliderDotsContainer) {
        // console.warn(`Elementos del slider no encontrados en el modal ${modalId}.`);
        return;
    }

    let currentSlide = 0;
    const totalSlides = sliderItems.length;

    // Crear los puntos de navegación
    sliderDotsContainer.innerHTML = ''; // Limpiar antes de crear
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        dot.dataset.slideIndex = i;
        dot.addEventListener('click', () => showSlide(i));
        sliderDotsContainer.appendChild(dot);
    }

    const sliderDots = modal.querySelectorAll('.slider-dot');

    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        const offset = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;

        // Actualizar la clase activa de los puntos
        sliderDots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Pausar videos cuando se cambia de slide
        sliderItems.forEach((item, i) => {
            const iframe = item.querySelector('iframe');
            if (iframe && i !== currentSlide) {
                // Reiniciar el src para detener el video
                const src = iframe.src;
                iframe.src = src; // Carga el iframe nuevamente, deteniendo la reproducción
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // AñadirEventListeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Mostrar la primera diapositiva al inicializar
    showSlide(0);
}


const textElement = document.getElementById("typewriter");
const texts = ["Desarrollador web: ", "Frontend &", "Backend."];
let index = 0;

setInterval(() => {
	textElement.classList.add("fade-out");
	setTimeout(() => {
		index = (index + 1) % texts.length;
		textElement.textContent = texts[index];
		textElement.classList.remove("fade-out");
	}, 500); // esperar que termine la transición
}, 2500);