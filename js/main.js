// Año automático
const year = document.getElementById("year");
const date = new Date();
year.innerText = date.getFullYear();

// Mostrar modal
function showModal(id) {
    const modal = document.getElementById(id);
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
    modal.classList.add('open');

    // Inicializar slider solo si es necesario
    // if (id === 'Portafolio' || id === 'POST' || id === 'YIZA') {
        initializeSlider(id);
    // }
}

// Ocultar modal
function hideModal(id) {
    const modal = document.getElementById(id);
    modal.style.opacity = 0;
    modal.style.visibility = "hidden";
    modal.classList.remove('open');
}

// Responsive menú
function responsive() {
    let nav = document.getElementById('nav');
    nav.classList.toggle('responsive');
}

// Marcar opción seleccionada del menú
function selected(link) {
    let opciones = document.querySelectorAll('#nav a');
    opciones.forEach(op => op.className = "");
    link.className = "selected";

    // Cerrar menú en modo responsive
    document.getElementById('nav').className = "";
}

// Máquina de escribir animada
const textElement = document.getElementById("typewriter");
const texts = ["Desarrollador web & ", "de Software: ", "Frontend &", "Backend."];
let index = 0;

setInterval(() => {
    textElement.classList.add("fade-out");
    setTimeout(() => {
        index = (index + 1) % texts.length;
        textElement.textContent = texts[index];
        textElement.classList.remove("fade-out");
    }, 500);
}, 2500);

// Inicializar slider con navegación, dots y miniaturas estilo Steam
function initializeSlider(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const sliderTrack = modal.querySelector('.slider-track');
    const sliderItems = modal.querySelectorAll('.slider-item');
    const prevBtn = modal.querySelector('.slider-nav.prev');
    const nextBtn = modal.querySelector('.slider-nav.next');
    const sliderDotsContainer = modal.querySelector('.slider-dots');
    const thumbnailsContainer = modal.querySelector('.slider-thumbnails');

    if (!sliderTrack || !sliderItems.length || !prevBtn || !nextBtn || !sliderDotsContainer || !thumbnailsContainer) {
        return;
    }

    let currentSlide = 0;
    const totalSlides = sliderItems.length;

    // Crear puntos de navegación
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        dot.dataset.slideIndex = i;
        dot.addEventListener('click', () => showSlide(i));
        sliderDotsContainer.appendChild(dot);
    }

    // Crear miniaturas estilo Steam
    thumbnailsContainer.innerHTML = '';
    sliderItems.forEach((item, i) => {
        const img = item.querySelector('img');
        const iframe = item.querySelector('iframe');
        const video = item.querySelector('video');

        const thumbnail = document.createElement('img');
        thumbnail.classList.add('slider-thumbnail');
        thumbnail.dataset.slideIndex = i;
        console.log(img)
        if (img) {
            thumbnail.src = img.src;
        } else if (iframe || video) {
            thumbnail.src = "https://img.icons8.com/ios-filled/50/video.png"; // miniatura por defecto
        } else {
            thumbnail.src = "https://via.placeholder.com/80x45";
        }

        thumbnail.alt = `Vista previa ${i + 1}`;
        thumbnail.addEventListener('click', () => showSlide(i));
        thumbnailsContainer.appendChild(thumbnail);
    });

    const sliderDots = modal.querySelectorAll('.slider-dot');
    const sliderThumbnails = modal.querySelectorAll('.slider-thumbnail');

    function showSlide(index) {
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;
        currentSlide = index;

        sliderTrack.style.transform = `translateX(-${index * 100}%)`;

        // Actualizar puntos
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Actualizar miniaturas
        sliderThumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Pausar videos de otros slides
        sliderItems.forEach((item, i) => {
            const iframe = item.querySelector('iframe');
            const video = item.querySelector('video');
            if ((iframe || video) && i !== currentSlide) {
                if (iframe) iframe.src = iframe.src;
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    showSlide(0);
}

// Animaciones al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll(".fade-in");

    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("appear");
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
