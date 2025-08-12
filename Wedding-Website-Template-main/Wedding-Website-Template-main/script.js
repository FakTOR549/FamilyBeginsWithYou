function showSection(sectionId) {
    // Скрываем выбор
    document.getElementById('choice').style.display = 'none';

    // Скрываем обе ветки
    document.querySelectorAll('.branch-content').forEach(el => {
        el.classList.add('hidden');
    });

    // Показываем нужную ветку
    const section = document.getElementById(sectionId);
    section.classList.remove('hidden');
    section.classList.add('fade-in');
}

function backToChoice() {
    // Скрыть все ветки
    document.querySelectorAll('.branch-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('fade-in');
    });

    // Показать выбор
    document.getElementById('choice').style.display = 'block';
}








// Предполагаем, что у вас уже есть функции showSection и backToChoice. Если нет, добавьте их:

function showSection(sectionId) {
    document.getElementById('choice').style.display = 'none';
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).style.display = 'block';

    // Если показываем egor-content, инициализируем слайд-шоу
    if (sectionId === 'egor-content') {
        initFairySlideshow();
    }
}

function backToChoice() {
    document.getElementById('darya-content').classList.add('hidden');
    document.getElementById('darya-content').style.display = 'none';
    document.getElementById('egor-content').classList.add('hidden');
    document.getElementById('egor-content').style.display = 'none';
    document.getElementById('choice').style.display = 'block';
}

// Функция инициализации слайд-шоу
function initFairySlideshow() {
    const slides = document.querySelectorAll('#egor-content .fairy-slide');
    const controlButtons = document.querySelector('#egor-content .control-buttons');
    const repeatBtn = document.querySelector('#egor-content .control-buttons .repeat');
    const nextBtn = document.querySelector('#egor-content .control-buttons .next');
    let currentIndex = 0;
    let isPlaying = true;

    // Функция для показа слайда
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            const glowColor = slide.dataset.glowColor || 'rgba(255, 182, 193, 0.4)';
            slide.style.setProperty('--glow-color', glowColor);
        });

        // Показываем кнопки на последнем слайде
        if (index === slides.length - 1) {
            controlButtons.classList.add('active');
        } else {
            controlButtons.classList.remove('active');
        }
    }

    // Функция для вычисления длительности слайда
    function getSlideDuration(slide) {
        const textLength = slide.querySelector('p').textContent.length;
        if (textLength < 50) return 3000;
        if (textLength < 100) return 4500;
        return 6000;
    }

    // Функция для перехода к следующему слайду
    function nextSlide() {
        if (!isPlaying) return;
        const currentSlide = slides[currentIndex];
        const duration = getSlideDuration(currentSlide);
        setTimeout(() => {
            currentIndex++;
            if (currentIndex < slides.length) {
                showSlide(currentIndex);
                nextSlide();
            } else {
                isPlaying = false;
                showSlide(currentIndex - 1);
            }
        }, duration);
    }

    // Обработчик для кнопки "Повторить"
    repeatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = 0;
        isPlaying = true;
        showSlide(currentIndex);
        nextSlide();
    });

    // Обработчик для кнопки "Далее" (адаптируйте href по необходимости)
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // window.location.href = '/history'; // Или ваша логика
    });

    // Инициализация
    showSlide(currentIndex);
    nextSlide();
}
