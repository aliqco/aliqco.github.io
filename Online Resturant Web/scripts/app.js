let menuBtn = document.querySelector(".mobile-menu");
let menu = document.querySelector(".menu");
let menuOpen = false;
const sections = document.querySelectorAll("main > section")
const menuItem = document.querySelectorAll('.menu__item')

menuBtn.addEventListener("click", function() {
    if (menuOpen) {
        menu.style.left = "-25rem";
        menuOpen = false;
    }
    else {
        menu.style.left = "0px";
        menuOpen = true;
    }
})

let menuItems = document.querySelectorAll(".food-menu__item");

function navigationTabsInit(listItems, listItemsActiveClass, contentItemShowClass) {
    listItems.forEach(listItem => {
        listItem.addEventListener("click", function(){
            document.querySelector(`.${listItemsActiveClass}`).classList.remove(listItemsActiveClass)
            document.querySelector(`.${contentItemShowClass}`).classList.remove(contentItemShowClass)
            this.classList.add(listItemsActiveClass)
            let contentId = this.getAttribute("data-content-id")
            document.querySelector(contentId).classList.add(contentItemShowClass)
        }) 
    })
}

navigationTabsInit(menuItems, 'food-menu__item--active', 'food-menu__products--show')

// scroll to
const observer = new IntersectionObserver(observerHandler, {
    threshold: 0.5
});

function observerHandler(allSection) {
    allSection.map(section => {
        let sectionClassName = section.target.className
        if (section.isIntersecting) {
            document.querySelector(`.menu__item[data-section=${sectionClassName}]`).classList.add("menu__item--active")
        } else {
            document.querySelector(`.menu__item[data-section=${sectionClassName}]`).classList.remove("menu__item--active")
        }
    })
}

sections.forEach(section => {
    observer.observe(section)
})

menuItem.forEach(Item => {
    Item.addEventListener("click", function(e) {
        e.preventDefault
        document.querySelector(".menu__item--active").classList.remove("menu__item--active")
        Item.classList.add("menu__item--active")
        let sectionClass = Item.getAttribute("data-section")
        let sectionOffsetTop =  document.querySelector(`.${sectionClass}`).offsetTop
        window.scrollTo( 
            {
                top: sectionOffsetTop - 150,
                behavior: "smooth"
            }
        )
    })
}) 