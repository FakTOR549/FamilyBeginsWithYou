(function () {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    const allSections = Array.from(document.querySelectorAll('section'));

    let heroSection = document.querySelector('section.hero');
    if (!heroSection && allSections.length) heroSection = allSections[0];
    if (heroSection && !heroSection.id) heroSection.id = 'hero';

    const welcome = $('#welcome');
    const choice = $('#choice');

    if (!heroSection || !welcome || !choice) {
      console.warn('Не найдены hero, welcome или choice — скрипт остановлен');
      return;
    }

    const sectionsById = {};
    allSections.forEach(s => { if (s.id) sectionsById[s.id] = s; });

    function hideAllSections() {
      allSections.forEach(s => {
        s.classList.remove('visible');
        s.classList.add('hidden');
      });
    }

    const initialIds = [heroSection.id, 'welcome', 'choice'].filter(Boolean);
    let currentGroup = [];
    let currentIndex = 0;

    const prevBtn = document.createElement('div');
    prevBtn.className = 'page-nav-arrow prev';
    prevBtn.innerHTML = '&#10094;';
    document.body.appendChild(prevBtn);

    const nextBtn = document.createElement('div');
    nextBtn.className = 'page-nav-arrow next';
    nextBtn.innerHTML = '&#10095;';
    document.body.appendChild(nextBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'back-to-choice';
    backBtn.textContent = '← Вернуться к выбору';
    document.body.appendChild(backBtn);

    // Анимация welcome
	function animateWelcomeText() {
	  const welcomeSection = document.getElementById('welcome');
	  if (!welcomeSection) return;

	  const paragraphs = welcomeSection.querySelectorAll('.fade-in-paragraph');

	  // Сброс состояния
	  paragraphs.forEach(p => p.classList.remove('active'));

	  // Запуск через маленькую задержку, чтобы успел примениться display
	  setTimeout(() => {
		paragraphs.forEach((paragraph, index) => {
		  setTimeout(() => {
			paragraph.classList.add('active');
		  }, index * 600);
		});
	  }, 50); // 50 мс задержка для надёжного запуска
	}

	function renderCurrent() {
	  hideAllSections();
	  currentGroup.forEach((el, i) => {
		if (i === currentIndex) {
		  el.classList.remove('hidden');
		  el.classList.add('visible');
		}
	  });

	  prevBtn.style.display = (currentIndex > 0) ? 'flex' : 'none';
	  nextBtn.style.display = (currentIndex < currentGroup.length - 1) ? 'flex' : 'none';
	  backBtn.style.display = (!initialIds.includes(currentGroup[0].id)) ? 'flex' : 'none';

	  // Если показываем welcome — запускаем анимацию
	  if (currentGroup[currentIndex] && currentGroup[currentIndex].id === 'welcome') {
		animateWelcomeText();
	  }
	}

    function setGroupByIds(ids, startIndex = 0) {
      currentGroup = ids.map(id => sectionsById[id]).filter(Boolean);
      if (!currentGroup.length) return;
      currentIndex = Math.max(0, Math.min(startIndex, currentGroup.length - 1));
      renderCurrent();
    }

    setGroupByIds(initialIds, 0);

    $$('.choice-btn').forEach(btn => {
      let target = btn.dataset.target;
      if (!target) {
        const onclick = btn.getAttribute('onclick') || '';
        const match = onclick.match(/showSection\(['"]?(.+?)['"]?\)/);
        if (match) target = match[1];
      }
      if (!target) {
        const txt = btn.textContent.toLowerCase();
        if (txt.includes('дарья')) target = 'darya';
        else if (txt.includes('егор')) target = 'egor';
      }
      if (!target) return;

      btn.addEventListener('click', e => {
        e.preventDefault();
        const storyId = target === 'darya' ? 'darya-story' : 'egor-story';
        const ids = ['choice'];
        if (sectionsById[storyId]) ids.push(storyId);
        ['timeline-section', 'video', 'gift'].forEach(id => {
          if (sectionsById[id]) ids.push(id);
        });
        const startIndex = ids.indexOf(storyId);
        setGroupByIds(ids, startIndex >= 0 ? startIndex : 0);
        $$('.choice-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    function goNext() {
      if (currentIndex < currentGroup.length - 1) {
        currentIndex++;
        renderCurrent();
      }
    }
    function goPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        renderCurrent();
      }
    }

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') backToChoice();
    });

    let startX = null;
    document.addEventListener('touchstart', e => {
      if (e.touches[0]) startX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goNext();
        else goPrev();
      }
      startX = null;
    });

    function backToChoice() {
      setGroupByIds(initialIds, initialIds.indexOf('choice'));
      $$('.choice-btn').forEach(b => b.classList.remove('active'));
    }
    backBtn.addEventListener('click', backToChoice);

    window.showSection = function(name) {
      const btn = $$('.choice-btn').find(b => {
        const onclick = b.getAttribute('onclick') || '';
        return onclick.includes(name) || (b.dataset.target || '').toLowerCase() === name || b.textContent.toLowerCase().includes(name);
      });
      if (btn) btn.click();
    };
  });
})();










// Инициализация слайд-шоу после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.fairy-slide');
    const controlButtons = document.querySelector('.control-buttons');
    const repeatBtn = document.querySelector('.control-buttons .repeat');
    const nextBtn = document.querySelector('.control-buttons .next');
    const vineContainer = document.querySelector('.vine-container');
    let currentIndex = 0;
    let isPlaying = true;

    // Массив с путями к изображениям лоз и их позициями
    // Как настроить лозы:
    // 1. Добавь свои изображения лоз в папку assets/Егор/vines/
    // 2. Для каждой лозы укажи путь и начальную позицию (left, bottom, и т.д.)
    // 3. Лозы будут появляться последовательно с каждым слайдом
    // 4. Чтобы изменить направление "ползания", настрой left, bottom, top, right
    //    Например, для ползания снизу слева используй bottom: 0, left: 0
    //    Для ползания сверху справа: top: 0, right: 0
    const vines = [
        { src: 'assets/Егор/vines/vine1.png', style: { bottom: '0', left: '40%', width: '200px' } },
        { src: 'assets/Егор/vines/vine2.png', style: { bottom: '50px', left: '50px', width: '200px' } },
        { src: 'assets/Егор/vines/vine3.png', style: { bottom: '100px', left: '100px', width: '200px' } },
		{ src: 'assets/Егор/vines/vine4.png', style: { bottom: '100px', left: '100px', width: '200px' } },
        // Добавь свои лозы здесь, например:
        // { src: 'assets/Егор/vines/vine4.png', style: { bottom: '150px', left: '150px', width: '200px' } },
        // Изменяй bottom/left или top/right для другого направления
    ];

    // Создаем элементы лоз
    vines.forEach((vine, index) => {
        const img = document.createElement('img');
        img.classList.add('vine');
        img.src = vine.src;
        Object.assign(img.style, vine.style);
        vineContainer.appendChild(img);
    });

    const vineElements = document.querySelectorAll('.vine');

    // Функция для показа слайда
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            const glowColor = slide.dataset.glowColor || 'rgba(255, 182, 193, 0.4)';
            slide.style.setProperty('--glow-color', glowColor);
        });

        // Показываем лозы постепенно
        vineElements.forEach((vine, i) => {
            vine.style.opacity = i <= Math.floor(index / (slides.length / vines.length)) ? '1' : '0';
        });

        // Показываем кнопки и бутоны на последнем слайде
        if (index === slides.length - 1) {
            controlButtons.classList.add('active');
            setTimeout(() => {
                const closedBuds = document.querySelector('.closed-buds');
                const openBuds = document.querySelector('.open-buds');
                if (closedBuds && openBuds) {
                    closedBuds.style.opacity = '0';
                    openBuds.classList.add('active');
                }
            }, 2000); // Задержка 2 секунды перед раскрытием бутонов
        } else {
            controlButtons.classList.remove('active');
            const closedBuds = document.querySelector('.closed-buds');
            const openBuds = document.querySelector('.open-buds');
            if (closedBuds && openBuds) {
                closedBuds.style.opacity = '1';
                openBuds.classList.remove('active');
            }
        }
    }

    // Функция для вычисления длительности слайда
    function getSlideDuration(slide) {
        const textLength = slide.querySelector('p').textContent.length;
        if (textLength < 50) return 3000; // Короткий текст: 3с
        if (textLength < 100) return 4500; // Средний текст: 4.5с
        return 6000; // Длинный текст: 6с
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

    // Обработчик для кнопки "Далее"
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/history';
    });

    // Инициализация
    showSlide(currentIndex);
    nextSlide();
});