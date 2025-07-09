document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.intlTelInput !== 'function') {
    console.error('intlTelInput not loaded! Check script includes');
    return;
  }

  const inputs = document.querySelectorAll('.phone');

  inputs.forEach((input) => {
    try {
      if (input.intlTelInput) {
        input.intlTelInput.destroy();
      }

      const iti = window.intlTelInput(input, {
        initialCountry: 'ru',
        preferredCountries: ['ru', 'kz', 'by', 'ua'],
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
        autoPlaceholder: 'off',
        formatOnDisplay: false,
        customPlaceholder: function () {
          return '';
        },
      });

      if (!input.value) {
        iti.setNumber('+7');
      }

      input.style.paddingLeft = '60px';
      input.style.width = '100%';
      input.style.color = 'inherit';

      console.log('ITI initialized for:', input, iti);
    } catch (e) {
      console.error('Error initializing phone input:', input, e);
    }
  });
});

//модальное окно

const modalWin = document.querySelector('.page__modal');
const btnOpenModal = document.querySelectorAll('.modal-btn');
let scrollPosition = 0;
let scrollbarWidth = 0;
let isModalOpen = false;

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function toggleModal() {
  if (isModalOpen) closeModal();
  else openModal();
}

function openModal() {
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  scrollbarWidth = getScrollbarWidth();

  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  modalWin.classList.add('modal');
  isModalOpen = true;
}

function closeModal() {
  modalWin.classList.remove('modal');
  isModalOpen = false;

  const restoreStyles = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.scrollBehavior = '';
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  };

  restoreStyles();
  window.scrollTo({ top: scrollPosition, behavior: 'instant' });

  setTimeout(restoreStyles, 20);
}

btnOpenModal.forEach((btn) => {
  btn.addEventListener('click', toggleModal);
});

modalWin.addEventListener('click', (e) => e.target === e.currentTarget && closeModal());
document.addEventListener('keydown', (e) => e.key === 'Escape' && isModalOpen && closeModal());

//burger меню

const burgerBtn = document.querySelector('.burger-btn');
const menu = document.querySelector('.navigation');

function toggleMenu() {
  menu.classList.toggle('navigation__active');
}

burgerBtn.addEventListener('click', toggleMenu);

//инпуты

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.modal__form');
  const inputs = document.querySelectorAll('input[required]');
  const errorMessage = document.querySelector('.error-message');

  // Флаг для отслеживания "грязности" формы (были ли взаимодействия)
  let isFormTouched = false;

  // Вешаем обработчики на все обязательные поля
  inputs.forEach((input) => {
    // При уходе с поля (blur) отмечаем как "тронутое" и проверяем
    input.addEventListener('blur', function () {
      this.classList.add('touched');
      validateField(this);
    });
  });

  // Обработка отправки формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    isFormTouched = true;

    let isFormValid = true;

    // Проверяем все поля
    inputs.forEach((input) => {
      input.classList.add('touched');
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Форма валидна - можно отправлять (здесь AJAX или form.submit())
      console.log('Форма валидна, отправляем данные');
      form.submit(); // Раскомментировать для реальной отправки
      alert('Форма отправлена!'); // Заглушка для демо
    } else {
      // Показываем общее сообщение об ошибке
      errorMessage.style.display = 'block';
    }
  });

  // Функция валидации одного поля
  function validateField(field) {
    const isValid = field.checkValidity();

    if (!isValid && (field.classList.contains('touched') || isFormTouched)) {
      field.style.borderColor = '#ff4444'; // Красная рамка
    } else {
      field.style.borderColor = ''; // Сброс стиля
    }

    return isValid;
  }
});
