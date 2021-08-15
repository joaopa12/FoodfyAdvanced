const button_ingredients = document.querySelector('.button_ingredients_hide')
const ingredients_content = document.querySelector('.content_ingredients')

const button_preparation_hide = document.querySelector('.button_preparation_hide')
const content_preparation = document.querySelector('.content_preparation')

const button_more_recipe_hide = document.querySelector('.button_more_recipe_hide')
const content_more_recipe = document.querySelector('.content_more_recipe')

button_ingredients.addEventListener("click",function(){
    if (ingredients_content.classList.contains('hide') == false){
        ingredients_content.classList.add('hide')
        button_ingredients.innerHTML = "Mostrar"
    }
    else{
        ingredients_content.classList.remove('hide')
        button_ingredients.innerHTML = "Esconder"
    }
})
/* está dando certo em cima , continuar... */
button_preparation_hide.addEventListener("click", function(){
    if (content_preparation.classList.contains('hide') == true){
        content_preparation.classList.remove('hide')
        button_preparation_hide.innerHTML = "Mostrar"
    }
    else{
        content_preparation.classList.add('hide')
        button_preparation_hide.innerHTML = "Esconder"
    }
})

button_more_recipe_hide.addEventListener("click", function(){
    if(content_more_recipe.classList.contains('hide') == false){
       content_more_recipe.classList.add('hide')
       button_more_recipe_hide.innerHTML = "Mostrar"
    }
    else{
        content_more_recipe.classList.remove('hide')
        button_more_recipe_hide.innerHTML = "Esconder"
    }

})

