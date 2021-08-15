const Modaloverlay = document.querySelector('.modal_overlay')
const cards = document.querySelectorAll('.card') /* tava .cards */
const modal = document.querySelector('.modal')
const contenthide = document.querySelector('.content_text_hide')


for(let card of cards){
    card.addEventListener("click",function(){
    Modaloverlay.classList.add("active")
    const id = card.getAttribute("id")
    const image = card.getAttribute("image")
    const title = card.querySelector('.card_title').textContent
    const description = card.querySelector('.card_description').textContent
    modal.querySelector('h1').innerHTML = title
    modal.querySelector('p').innerHTML = description
    Modaloverlay.querySelector('img').src = `${image}`
    document.querySelector('.details').addEventListener('click', function(){
        window.location.href = `/Receitas/${id}`
    })
    })
} 

document.querySelector('.fechar').addEventListener('click', function(){
    Modaloverlay.classList.remove('active')
})

document.querySelector('.fechar').addEventListener('click', function(){
    Modaloverlay.classList.add('removemodal')
    setTimeout(function(){
        Modaloverlay.classList.remove('removemodal')
    }, 500)   
})

function paginate(selectedPage, totalPages){
    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++){

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2 
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
        
        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage){
                  
            if(oldPage && currentPage - oldPage > 2){
                pages.push("...")
            }          
            if(oldPage && currentPage - oldPage == 2){
                pages.push(currentPage - 1)
            }
       
            pages.push(currentPage)
            oldPage = currentPage 
        }
    }    
    return pages
}
function CreatePagination(pagination){
    const filter = pagination.dataset.filter;
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total;
    const pages = paginate(page, total)

    let elements = ""

    for(let page of pages){
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`
        }
        else{
            if(filter){
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
    console.log(pages)
}

const pagination = document.querySelector(".pagination")

if(pagination){
    CreatePagination(pagination)
}