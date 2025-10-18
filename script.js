document.addEventListener('DOMContentLoaded', () => {

    // 1. MENU RESPONSIVO (Toggle)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');

    menuToggle.addEventListener('click', () => {
        const isActive = mainNav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        menuToggle.textContent = isActive ? '✖' : '☰'; 
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) { 
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });

    // 2. EFEITO SCROLL REVEAL (Animação de entrada)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // 3. LÓGICA DO MINI-CARROSSEL PARA MÚLTIPLOS PROJETOS (Navegação e Arrastável)

    const initCarousel = (id) => {
        const track = document.getElementById(`${id}-track`);
        if (!track) return;

        const slides = Array.from(track.children);
        if (slides.length <= 1) return; 

        const nextButton = document.querySelector(`.mini-carousel-control.next[data-target="${id}"]`);
        const prevButton = document.querySelector(`.mini-carousel-control.prev[data-target="${id}"]`);

        let slideIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        const getSlideWidth = () => slides[0] ? slides[0].getBoundingClientRect().width : 0;

        // Move para o slide específico
        const moveToSlide = (targetIndex) => {
            const slideWidth = getSlideWidth();
            const amountToMove = slideWidth * targetIndex;
            track.style.transform = 'translateX(-' + amountToMove + 'px)'; 
            slideIndex = targetIndex;
        };
        
        // Navegação por Botão
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                let nextIndex = (slideIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                let prevIndex = (slideIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
            });
        }
        
        // Responsividade: Recalcula ao redimensionar
        window.addEventListener('resize', () => {
            moveToSlide(slideIndex);
        });

        // Funcionalidade de Arrastar (Drag/Swipe)
        const dragStart = (e) => {
            isDragging = true;
            startPos = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            prevTranslate = -getSlideWidth() * slideIndex;
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.3s ease-in-out';
            track.style.cursor = 'grab';
            
            const movedBy = currentTranslate - prevTranslate;
            
            if (movedBy < -50) {
                let nextIndex = (slideIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            } else if (movedBy > 50) {
                let prevIndex = (slideIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
            } else {
                moveToSlide(slideIndex);
            }
        };

        const drag = (e) => {
            if (!isDragging) return;
            if (e.type.includes('touch')) e.preventDefault(); 
            
            const currentPosition = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        // Eventos de Mouse
        track.addEventListener('mousedown', dragStart);
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('mousemove', drag);

        // Eventos de Toque (Mobile)
        track.addEventListener('touchstart', dragStart);
        window.addEventListener('touchend', dragEnd);
        track.addEventListener('touchmove', drag);
    };

    // Inicializa todos os carrosséis
    const carouselIds = ['logistica', 'churn', 'saas']; // Lista de IDs de carrosséis
    carouselIds.forEach(id => initCarousel(id));
});