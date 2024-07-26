let bottomNav = document.querySelectorAll(".mobile-nav__link");

function navigationTabsInit(listItems, listItemsActiveClass, contentItemShowClass) {
    listItems.forEach(listItem => {
        listItem.addEventListener("click", function(){
            document.querySelector(`.${listItemsActiveClass}`).classList.remove(listItemsActiveClass)
            this.classList.add(listItemsActiveClass)
            let contentId = this.getAttribute("data-content-id")
        }) 
    })
}

navigationTabsInit(bottomNav, 'mobile-nav__link--active')
