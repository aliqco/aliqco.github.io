let darkModeSwitch = document.querySelectorAll('.dark-mode--switch');
let mobileMenu = document.getElementById('mobile-menu');

let mobileMenuBtn = document.getElementById('mobile-menu__btn');
let mobileMenuCover = document.querySelector('.cover');

let mobileMenuClose = document.getElementById('mobile-menu__close');
let cartMenuClose = document.getElementById('cart-menu__close');
let arrowDown = document.querySelector('.arrow-down'); // Arrow down for open menu
let shopMenuItem = document.querySelector('.shop-menu__item');

let cartIcon = document.querySelector('.cart-icon');
let cartMenu = document.getElementById('cart-menu');

darkModeSwitch.forEach(function(dark) {
    dark.addEventListener("click" , function() {
        if (localStorage.theme === "dark"){
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light"; 
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme" , "dark");
        }
    })
})

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.style.right = '0px';
    mobileMenuCover.classList.add('cover--show')
})

mobileMenuClose.addEventListener('click', function() {
    mobileMenu.style.right = '-256px';
    mobileMenuCover.classList.remove('cover--show')
    shopMenuItem.classList.remove('shop-menu__item--show');
    arrowDown.parentElement.classList.remove('text-orange-300')
    arrowDown.style.transform = 'rotate(0deg)'  
})
cartIcon.addEventListener('click', function() {
    cartMenu.style.left = '0px';
    mobileMenuCover.classList.add('cover--show')
})
cartMenuClose.addEventListener('click', function() {
    cartMenu.style.left = '-256px';
    mobileMenuCover.classList.remove('cover--show')
})

arrowDown.addEventListener('click', function() {
    if (shopMenuItem.classList.contains('shop-menu__item--show')) {
        shopMenuItem.classList.remove('shop-menu__item--show');
        arrowDown.style.transform = 'rotate(0deg)'
        arrowDown.parentElement.classList.remove('text-orange-300')
    } else {
        shopMenuItem.classList.add('shop-menu__item--show');
        arrowDown.style.transform = 'rotate(180deg)'
        arrowDown.parentElement.classList.add('text-orange-300')
    } 
})

mobileMenuCover.addEventListener('click', function() {
    cartMenu.style.left = '-256px';
    mobileMenu.style.right = '-256px';
    mobileMenuCover.classList.remove('cover--show')
    shopMenuItem.classList.remove('shop-menu__item--show');
    arrowDown.style.transform = 'rotate(0deg)'
    arrowDown.parentElement.classList.remove('text-orange-300')
})
