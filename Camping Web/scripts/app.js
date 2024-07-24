const navBtn = document.querySelector(".nav__btn")
let navOpen = false
let navMenu = document.querySelector(".nav-menu")

navBtn.addEventListener("click", function() {
    // if (navMenu.classList.contains("left")) {
        
    // }
    if (navOpen) {
        navMenu.style.left = "-25rem"
        navBtn.classList.remove("nav__btn--open")
        navOpen = false
    } else {
        navMenu.style.left = "0px"
        navBtn.classList.add("nav__btn--open")
        navOpen = true
    }
})