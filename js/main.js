// коды регионов

const input = document.querySelectorAll('.phone');
input.forEach((inp) =>
  window.intlTelInput(inp, {
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
    preferredCountries: ['ru', 'us', 'gb'],
    separateDialCode: true,
    initialCountry: 'ru',
  })
);

// header меню

const menuList = document.querySelector('.navigation');
const menuBurger = document.querySelector('.burger-btn');

menuBurger.addEventListener('click', function () {
  menuList.classList.toggle('navigation__active');
});
