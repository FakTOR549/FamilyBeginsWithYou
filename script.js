document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing script...');

  const choice = document.getElementById('choice');
  const branches = document.querySelectorAll('.branch-content');

  // Егор
  const egorContent = document.getElementById('egor-content');
  const egorStory   = document.getElementById('egor-story');
  const toStart     = document.getElementById('toStart');
  const toChoice    = document.getElementById('toChoice');

  // Даша (НОВОЕ)
const daryaContent  = document.getElementById('darya-content');
const daryaStory    = document.getElementById('darya-story');
const toStartDarya  = document.getElementById('toStartDarya');
const toChoiceDarya = document.getElementById('toChoiceDarya');

  const welcomeSection = document.getElementById('welcome');
const audio = document.getElementById('bg-music');
if (!audio) {
  console.error('Audio element with id "bg-music" not found. Please add <audio id="bg-music" src="path/to/music.mp3" loop> to your HTML.');
  return;
}
  
  let musicStarted = false;

function fadeVolume(el, from, to, duration) {
  const steps = 30;
  let currentStep = 0;
  const stepTime = duration / steps;
  el.volume = from;
  const interval = setInterval(() => {
    currentStep++;
    el.volume = from + (to - from) * (currentStep / steps);
    if (currentStep >= steps) clearInterval(interval);
  }, stepTime);
}

function startMusic() {
  if (!musicStarted) {
    audio.play().then(() => {
      fadeVolume(audio, 0, 0.3, 3000); // плавный старт за 3 сек
      musicStarted = true;
    }).catch(err => {
      console.log('Автоплей заблокирован, ждём клика:', err);
    });
  }
}

function stopMusic() {
  fadeVolume(audio, audio.volume, 0, 3000); // плавно убавить громкость
  setTimeout(() => audio.pause(), 3000); // стоп после затухания
  musicStarted = false;
}

// Запускаем музыку при первом взаимодействии
['click', 'mousemove', 'touchstart', 'scroll'].forEach(evt => {
  window.addEventListener(evt, startMusic, { once: true });
});


  // Навигация "В начало"
  if (toStart) {
    toStart.addEventListener('click', (e) => {
      e.preventDefault();
      if (welcomeSection) {
        welcomeSection.classList.remove('hidden');
        welcomeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
if (toStartDarya) {
  toStartDarya.addEventListener('click', (e) => {
    e.preventDefault();
    if (welcomeSection) {
      welcomeSection.classList.remove('hidden');
      welcomeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

if (toChoiceDarya) {
  toChoiceDarya.addEventListener('click', (e) => {
    e.preventDefault();
    backToChoice();
  });
}

  // Навигация "К выбору истории"
  if (toChoice) {
    toChoice.addEventListener('click', (e) => {
      e.preventDefault();
      backToChoice();
    });
  }
  if (toChoiceDarya) {
    toChoiceDarya.addEventListener('click', (e) => {
      e.preventDefault();
      backToChoice();
    });
  }

  // --- Анимация текста второй секции (#welcome) при активации ---
  if (welcomeSection) {
    const welcomeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = welcomeSection.querySelector('.fade-in-text');
          if (container && !container.classList.contains('run')) {
            container.classList.add('run');
          }
          welcomeObserver.unobserve(welcomeSection);
        }
      });
    }, { threshold: 0.6 });

    const textContainer = welcomeSection.querySelector('.fade-in-text');
    if (textContainer) textContainer.classList.remove('run');
    welcomeObserver.observe(welcomeSection);
  }

  // Показ ветки
  window.showSection = (sectionId) => {
    // скрываем выбор и все ветки
    choice && choice.classList.add('hidden');
    branches.forEach(b => b.classList.add('hidden'));

    const section = document.getElementById(sectionId);
    if (!section) {
      console.error('Section not found:', sectionId);
      // если секции нет — вернем обратно выбор, чтобы не остаться на пустом экране
      choice && choice.classList.remove('hidden');
      return;
    }

    section.classList.remove('hidden');
    section.classList.add('fade-in');

    // Ветка Егора — фиксированное слайдшоу
    if (sectionId === 'egor-content' && egorStory && egorContent) {
      setTimeout(() => {
        initFairySlideshowFor(egorContent, egorStory);
        egorStory.classList.add('fixed');
        document.body.classList.add('lock-scroll');
        egorStory.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    // Ветка Даши — фиксированное слайдшоу (НОВОЕ)
    if (sectionId === 'darya-content' && daryaStory && daryaContent) {
      setTimeout(() => {
        initFairySlideshowFor(daryaContent, daryaStory);
        daryaStory.classList.add('fixed');
        document.body.classList.add('lock-scroll');
        daryaStory.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    // По умолчанию просто скроллим к секции
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Возврат к выбору
  window.backToChoice = () => {
    // снимаем фиксацию с обоих слайдшоу, если вдруг активны
    if (egorStory) egorStory.classList.remove('fixed', 'completed', 'hidden');
    if (daryaStory) daryaStory.classList.remove('fixed', 'completed', 'hidden');
    document.body.classList.remove('lock-scroll');

    branches.forEach(b => b.classList.add('hidden'));
    if (choice) {
      choice.classList.remove('hidden');
      choice.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Универсальная инициализация слайдшоу для ветки.
   * rootEl  — контейнер ветки (#egor-content / #darya-content)
   * storyEl — секция слайдшоу внутри ветки (#egor-story / #darya-story)
   */
  function initFairySlideshowFor(rootEl, storyEl) {
    console.log('Init slideshow for:', rootEl.id);

    const controls        = rootEl.querySelector('.control-buttons');
    const floatingButtons = rootEl.querySelector('.floating-buttons');

    if (!controls || !floatingButtons) {
      console.error('Controls or floating buttons missing:', { controls, floatingButtons });
      return;
    }
    if (controls.dataset.bound === '1') {
      console.log('Slideshow already bound, skipping initialization');
      return;
    }
    controls.dataset.bound = '1';

    const slides   = rootEl.querySelectorAll('.fairy-slide');
    const nextBtn  = controls.querySelector('.next');
    const repeatBtn = controls.querySelector('.repeat');
    const backBtn   = rootEl.querySelector('.back-btn'); // опционально
    const repeatSlideshowBtn = floatingButtons.querySelector('.repeat-slideshow');
    const continueBtn        = floatingButtons.querySelector('.continue');

    if (!slides.length || !nextBtn || !repeatBtn || !repeatSlideshowBtn || !continueBtn) {
      console.error('Slideshow elements missing:', {
        slides: slides.length, nextBtn, repeatBtn, repeatSlideshowBtn, continueBtn
      });
      return;
    }

    let index = 0;
    let autoTimer;

function render() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    const glow = slide.dataset.glowColor || 'rgba(255, 182, 193, 0.4)';
    slide.style.setProperty('--glow-color', glow);
  });

  nextBtn.textContent = index === slides.length - 1 ? 'Завершить' : 'Далее';

if (index === slides.length - 1) {
  stopMusic(); // Остановка музыки на последнем слайде
}

  if (index === slides.length - 1) {
    clearInterval(autoTimer);
    floatingButtons.classList.remove('hidden');
    floatingButtons.classList.add('show');
  } else {
    floatingButtons.classList.add('hidden');
    floatingButtons.classList.remove('show');
  }
}

    function goNext() {
      if (index < slides.length - 1) {
        index++;
        render();
      } else {
        render(); // чтобы показать плавающие кнопки
      }
    }

    function startAutoSlide() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (index < slides.length - 1) {
          goNext();
        } else {
          clearInterval(autoTimer);
          render(); // покажет кнопки на последнем слайде
        }
      }, 5000);
    }

    function resetSlideshowAndStart() {
      clearInterval(autoTimer);
      index = 0;
      floatingButtons.classList.add('hidden');
      floatingButtons.classList.remove('show');
      render();
      startAutoSlide();
    }

    function proceedToHero() {
      // убрать фиксацию и заблокированный скролл
      storyEl.classList.remove('fixed');
      document.body.classList.remove('lock-scroll');
      storyEl.classList.add('completed');

      // спрятать "верхние" секции
      if (welcomeSection) welcomeSection.classList.add('hidden');
      if (choice) choice.classList.add('hidden');
      storyEl.classList.add('hidden');
      floatingButtons.classList.add('hidden');

      if (backBtn) backBtn.classList.add('hidden');

      const nextSection = rootEl.querySelector('.hero');
      if (nextSection) {
        nextSection.classList.remove('hidden');
        nextSection.classList.add('fade-in');
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.error('Hero section not found in', rootEl.id);
      }
    }

    // События
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goNext();
    });

    repeatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetSlideshowAndStart();
    });

    repeatSlideshowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetSlideshowAndStart();
    });

    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      proceedToHero();
    });

    // Первый запуск
    render();
    startAutoSlide();
  }

  // Декоративная анимация для текстов в секции выбора (как у тебя было)
  const secondSection = document.getElementById('choice');
  if (secondSection) {
    const lines = secondSection.querySelectorAll('p');
    const secondObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('visible'), i * 300);
          });
          secondObserver.unobserve(secondSection);
        }
      });
    }, { threshold: 0.6 });
    secondObserver.observe(secondSection);
  }

});



