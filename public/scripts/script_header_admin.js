const currentPage = location.pathname
console.log(currentPage)
const menuItems = document.querySelectorAll('header .linksadmin a')
console.log(menuItems)
for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add('active_page_admin')
    }
}