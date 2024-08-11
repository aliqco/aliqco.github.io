let darkModeSwitch = document.querySelectorAll('.dark-mode--switch');
let mobileMenu = document.getElementById('mobile-menu');

let menuBarIcon = document.getElementById('mobile-menu__btn');
let mobileMenuCover = document.querySelector('.cover');
let loginMenuCover = document.querySelector('.cover-login');

let menuCloseIcon = document.getElementById('mobile-menu__close');
let cartMenuClose = document.getElementById('cart-menu__close');
let arrowDown = document.querySelector('.arrow-down'); // Arrow down for open menu
let shopMenuItem = document.querySelector('.shop-menu__item');

// Shopping cart
let menuCartIcon = document.querySelector('.cart-icon');
let cartMenu = document.getElementById('cart-menu');

let productsContainer = document.querySelector('.products-container');

let loginFormModalBox = document.getElementById('login-form');
let DesktoploginFormButton = document.querySelector('.desktop-login');
let mobileloginFormButton = document.querySelector('.mobile-login');
let loginFormCloseButton = document.getElementById('login-form--close');
// Dynamic products

allProducts = [
    {id: 1, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p1.png', price: '175000', offer: true, offerPrecent: 12},
    {id: 2, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p2.png', price: '331000', offer: false, offerPrecent: 0},
    {id: 3, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p3.png', price: '1614000', offer: true, offerPrecent: 25},
    {id: 4, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p4.png', price: '238000', offer: true, offerPrecent: 10},
    {id: 5, exist: false, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p1.png', price: '115000', offer: false, offerPrecent: 0},
    {id: 6, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p2.png', price: '154000', offer: false, offerPrecent: 0},
    {id: 7, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p3.png', price: '521000', offer: false, offerPrecent: 0},
    {id: 8, exist: true, name: 'قهوه ترک بن مانو مقدار 250 گرم خط دوم اسم طولانی', image: 'images/products/p4.png', price: '431000', offer: true, offerPrecent: 89},
]


allProducts.forEach(function(product) {
    let offerPrecentOfItem;
    let offerPriceItem;

    if (product.exist) {
        if (product.offer) {
            offerPrecentOfItem = '<div class="absolute bg-orange-300 font-DanaDemiBold text-white text-xs md:text-base dark:text-zinc-700 h-5 md:h-[30px] px-2.5 md:px-3.5 rounded-full"><span class="text-xs/[24px] md:text-base/[34px]">'+ product.offerPrecent + '%' +'</span></div>'
            
            let offerPriceCalc = Number(product.price) * (product.offerPrecent * 0.01);
            let finalOfferPrice = Number(product.price) - Number(offerPriceCalc);
            if (finalOfferPrice == 0) {
                offerPriceItem = '<div class="text-teal-600 dark:text-teal-500"><span class="md:text-xl font-DanaDemiBold">رایگان!</span><span class="text-xs md:text-sm font-Dana tracking-tighter"></span></div><div class="text-gray-400"><span class="offer-price text-xs md:text-xl">' + Number(product.price).toLocaleString() + '</span><span class="text-xs md:text-sm font-Dana hidden xl:inline tracking-tighter"> تومان</span></div>'
            } else {
                finalOfferPrice = finalOfferPrice.toLocaleString();
                offerPriceItem = '<div class="text-teal-600 dark:text-teal-500"><span class="md:text-xl font-DanaDemiBold">' + finalOfferPrice + '</span><span class="text-xs md:text-sm font-Dana tracking-tighter"> تومان</span></div><div class="text-gray-400"><span class="offer-price text-xs md:text-xl">' + Number(product.price).toLocaleString() + '</span><span class="text-xs md:text-sm font-Dana hidden xl:inline tracking-tighter"> تومان</span></div>'
            }
    
        } else {
            offerPrecentOfItem = '';
            offerPriceItem = '<div class="text-teal-600 dark:text-teal-500"><span class="md:text-xl font-DanaDemiBold">' + Number(product.price).toLocaleString() + '</span><span class="text-xs md:text-sm font-Dana tracking-tighter"> تومان</span></div>'
        }
    } else {
        offerPrecentOfItem = '';
        offerPriceItem = '<span class="text-red-400 text-base md:text-xl">فعلا موجود نیست</span>';
    }

    productsContainer.insertAdjacentHTML("beforeend", '<div class="bg-white dark:bg-zinc-700 shadow-normal rounded-2xl p-2 md:p-5 relative">' + offerPrecentOfItem + '<a href="#" class="flex-center w-auto"><img class="w-32 mx-auto md:w-full" src="' + product.image + '" alt="Products image" loading="lazy"></a><h3 class="h-10 md:h-14"><a href="#" class="text-sm md:text-xl font-DanaMedium text-zinc-700 dark:text-white line-clamp-2 mt-2 md:mt-5"> ' + product.name + '</a></h3><div class="mt-1.5 md:mt-2.5 mb-2.5 md:mb-4 flex items-center gap-x-2 md:gap-x-2.5"> ' + offerPriceItem + '</div><div class="flex items-center justify-between"><div class="flex items-center gap-x-2.5 md:gap-x-3 text-gray-400"><div class="w-[26px] h-[26px] md:w-9 md:h-9 flex-center bg-gray-100 transition-all hover:bg-teal-600 dark:bg-zinc-800 dark:hover:bg-emerald-500  hover:text-white dark:hover:text-white rounded-full md:cursor-pointer"><svg class="w-4 h-4 md:w-[22px] md:h-[22px]"><use href="#shopping-cart"></use></svg></div><div class="hover:text-teal-600 dark:hover:text-emerald-500 transition-all"><svg class="w-4 h-4 md:w-6 md:h-6"><use href="#arrows-right-left"></use></svg></div></div><div class="flex items-center text-yellow-400"><svg class="w-4 h-4 md:w-6 md:h-6 text-gray-300 dark:text-gray-400"><use href="#star"></use></svg><svg class="w-4 h-4 md:w-6 md:h-6"><use href="#star"></use></svg><svg class="w-4 h-4 md:w-6 md:h-6"><use href="#star"></use></svg><svg class="w-4 h-4 md:w-6 md:h-6"><use href="#star"></use></svg><svg class="w-4 h-4 md:w-6 md:h-6"><use href="#star"></use></svg></div></div></div></div>')

})



menuBarIcon.addEventListener('click', function() {
    mobileMenu.style.right = '0px';
    mobileMenuCover.classList.add('cover--show')
})

menuCloseIcon.addEventListener('click', function() {
    mobileMenu.style.right = '-256px';
    mobileMenuCover.classList.remove('cover--show')
    shopMenuItem.classList.remove('shop-menu__item--show');
    arrowDown.parentElement.classList.remove('text-orange-300')
    arrowDown.style.transform = 'rotate(0deg)'  
})
menuCartIcon.addEventListener('click', function() {
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


// Dark and Light
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


function openLoginModal() {
    loginFormModalBox.style.visibility = 'visible';
    loginFormModalBox.style.opacity = '1';
    loginMenuCover.style.display = 'block'
    loginMenuCover.classList.add('cover--show')
}

function openLoginModalInMobile() {
    loginFormModalBox.style.visibility = 'visible';
    loginFormModalBox.style.opacity = '1';
}
function closeLoginModal() {
    loginFormModalBox.style.visibility = 'hidden';
    loginFormModalBox.style.opacity = '0';
    loginMenuCover.style.display = 'none';
    loginMenuCover.classList.remove('cover--show')
}

DesktoploginFormButton.addEventListener('click', function(event) {
    event.preventDefault();
    openLoginModal()
});
mobileloginFormButton.addEventListener('click', function(event) {
    event.preventDefault();
    openLoginModalInMobile()
});

loginFormCloseButton.addEventListener('click', function(event) {
    event.preventDefault();
    closeLoginModal()
})

loginMenuCover.addEventListener('click', function() {
    loginFormModalBox.style.visibility = 'hidden';
    loginFormModalBox.style.opacity = '0';
    loginMenuCover.classList.remove('cover--show')
})