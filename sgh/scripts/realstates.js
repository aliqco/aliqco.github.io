
const realStatesContainer = document.querySelector('.realstates-container');

const realStates = [
    {id:1, img: "images/realstates/tooc.png", name: "مشاور املاک توسی", address: "تهران، نیاوران، سه راه یاسر", rate: 4.9, activeAds: 2000, comments: 43},
    {id:2, img: "images/realstates/valiasr.png", name: "مشاور املاک ولیعصر", address: "تهران، خیابان ولیعصر، خیابان توانیر", rate: "4", activeAds: 1000, comments: 11},
    {id:3, img: "images/realstates/mohammdi.png", name: "مشاور املاک محمدی", address: "تهران، خیابان زرتشت ", rate: "3", activeAds: 2000, comments: 14},
    {id:4, img: "images/realstates/tooc.png", name: "مشاور املاک قهرمانی", address: "کرج خیابان شهید رضاپور ", rate: "5", activeAds: 2430, comments: 21},
];

realStates.forEach(realState => {
    realStatesContainer.insertAdjacentHTML("beforeend", `<div class="shadow-normal py-4 md:py-8 px-3 rounded-2xl border      border-secondary-gray-4 ">
                        <div class="flex justify-center mb-4">
                            <a href="realstate.html?id=${realState.id}">
                                <img class="w-[46px] md:w-[94px]" src="${realState.img}" alt="Realstates Logo">
                            </a>
                        </div>
                        <div class="">
                            <a href="realstate.html?id=${realState.id}" class="flex items-center justify-center gap-x-2 mb-2">
                                <h2 class="text-secondary-gray-12 text-xs md:text-xl font-ShabnamBold">
                                    ${realState.name}
                                </h2>
                                <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#4570B5"></path>
                                    <path opacity="0.5" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#4570B5"></path>
                                    <path d="M6.56926 11.1275L4.33996 8.85999C4.32013 8.84043 4.30438 8.81713 4.29363 8.79144C4.28288 8.76574 4.27734 8.73816 4.27734 8.71031C4.27734 8.68245 4.28288 8.65488 4.29363 8.62918C4.30438 8.60349 4.32013 8.58018 4.33996 8.56063L5.51512 7.40458C5.55504 7.36529 5.6088 7.34327 5.66481 7.34327C5.72081 7.34327 5.77457 7.36529 5.81449 7.40458L6.58201 8.17846C6.60156 8.1983 6.62487 8.21405 6.65056 8.2248C6.67626 8.23555 6.70383 8.24109 6.73169 8.24109C6.75954 8.24109 6.78712 8.23555 6.81281 8.2248C6.83851 8.21405 6.86181 8.1983 6.88137 8.17846L10.203 4.85999C10.2226 4.84015 10.2459 4.8244 10.2716 4.81365C10.2973 4.8029 10.3249 4.79736 10.3527 4.79736C10.3806 4.79736 10.4081 4.8029 10.4338 4.81365C10.4595 4.8244 10.4828 4.84015 10.5024 4.85999L11.6648 6.02241C11.6877 6.04214 11.7061 6.06658 11.7187 6.09406C11.7313 6.12154 11.7378 6.15142 11.7378 6.18165C11.7378 6.21188 11.7313 6.24175 11.7187 6.26923C11.7061 6.29671 11.6877 6.32115 11.6648 6.34088L6.88774 11.1371C6.86705 11.1589 6.84198 11.1761 6.81417 11.1876C6.78636 11.1991 6.75644 11.2046 6.72636 11.2037C6.69629 11.2028 6.66674 11.1955 6.63967 11.1824C6.61259 11.1693 6.5886 11.1506 6.56926 11.1275Z" fill="white"></path>
                                </svg>      
                            </a>
                            <div class="text-secondary-gray-9 text-xs md:text-base flex flex-col items-center space-y-2">
                                <span class="block text-secondary-gray-11 text-xs md:text-xl">
                                    ${realState.address}
                                </span>
                                <span class="block">
                                    میزان رضایتمندی: ${realState.rate} از ۵
                                </span>
                                <span class="block">
                                    آگهی‌های فعال: بیش از ${realState.activeAds} 
                                </span>
                                <a href="#">
                                    مشاهده نظرات کاربران (${realState.comments} نظر)
                                </a>
                            </div>
                        </div>
                    </div>`)
})