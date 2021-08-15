const ingredients = document.querySelector(".ingredients")
const button = document.querySelector('.add_ingredient')
const preparations = document.querySelector(".preparations")
const button_preparation = document.querySelector(".add_preparation")

button.addEventListener("click", function (){
    const fields_Ingredients = document.querySelectorAll(".ingredient")
    const New_field = fields_Ingredients[fields_Ingredients.length - 1].cloneNode(true)
    
    if(New_field.children[0].value == ""){
        return false
    }

    New_field.children[0].value = "";
    ingredients.appendChild(New_field);
} 
)
button_preparation.addEventListener("click", function (){
    const fields_preparations = document.querySelectorAll(".preparation")
    const New_field_preparation = fields_preparations[fields_preparations.length - 1].cloneNode(true)
    
    if(New_field_preparation.children[0].value == ""){
        return false
    }

    New_field_preparation.children[0].value = "";
    preparations.appendChild(New_field_preparation);
}
)

