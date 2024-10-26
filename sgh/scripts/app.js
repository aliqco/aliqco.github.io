let menuOpenButton = document.querySelector('.menu-button--open');
let menuCloseButton = document.querySelector('.menu-button--close');
let mobileMenu = document.querySelector('.mbile-menu');

let mobileInput = document.querySelector('#number');

let loginButtons = document.querySelectorAll('.login-button');
let loginModalBox = document.querySelector('.login-modal-box');
let closeModalButton = document.querySelector('.modal-button--close');

let overlay = document.querySelector('.overlay');


function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--show');
}
function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--show');
}
function openLoginModal() {
    loginModalBox.classList.add('login-modal-box--show');
    overlay.classList.add('overlay--show');
    setTimeout(function() {
        mobileInput.focus();
    }, 300);
}
function closeLoginModal() {
    loginModalBox.classList.remove('login-modal-box--show');
    overlay.classList.remove('overlay--show');
}
function changeInputDirection() {
    if (mobileInput.value.trim() === '') {
        mobileInput.setAttribute('dir', 'rtl');
    } else {
        mobileInput.setAttribute('dir', 'ltr');
    }
}


menuOpenButton.addEventListener('click', openMobileMenu);
menuCloseButton.addEventListener('click', closeMobileMenu);
loginButtons.forEach(function(loginButton) {
    loginButton.addEventListener('click', function() {
        closeMobileMenu();
        openLoginModal();
    });
})

closeModalButton.addEventListener('click', closeLoginModal);
overlay.addEventListener('click', closeLoginModal)
mobileInput.addEventListener('input', changeInputDirection)
