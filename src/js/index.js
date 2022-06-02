import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/SearchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


// ---------------------------  Search Controller---------------------------
/* Global State of the app
 * - Search Object
 * - Current Recipe Object
 * - Shopping list Object
 * - Liked Recipes
 */

const state = {};
const controlSearch = async ()=> {
    // 1) Get Query  from view 
    const query = searchView.getInput();

    if(query){
        // 2)  New search object and add to state
        state.search = new Search(query);
        
        // 3) Prepare UI for Result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
            // 4) Search for recipes
            await state.search.getResults();
            
            // 5) Render result on UI 
            clearLoader();
            searchView.renderResult(state.search.result);
            
        } catch(err){
            alert('Error processing Search');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, gotoPage);
    }
});
//-------------------------------------- Recipe Controller---------------------

const controlRecipe = async ()=>{
    // Get Id  From Url
    const id = window.location.hash.replace('#', '');
    // console.log(id);
    
    if(id){
        // prepare UI for Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected Search Item
       if(state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);
        
        try{


            // Get Recipe Data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parsIngredients();
    
            // Calculate Serving and time
            state.recipe.calcTime();
            state.recipe.calcServing();
    
            //Render Recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch(err){
            console.log(`Error Processing Recipe!`);
        }
    }
};

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//-------------------------------------- List Controller---------------------
// renderItem
    const controlList = ()=>{

        // create a new list if there is none yet
        if(!state.list) state.list = new List();
        
        // First clear the old list ... 
        listView.clearItemList();
        // Add each ingredient to the list and UI
        state.recipe.ingredients.forEach(el =>{
            const item =state.list.addItem(el.count, el.unit, el.ingredient);
            listView.renderItem(item);
        });
    };

//-------------------------- Handle delete and update list item events---------------------

 elements.shopping.addEventListener('click', e=>{
    // console.log(e);
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button 

    if(e.target.matches('.shopping__delete, .shopping__delete * ')){
        
        // delete from the sate.
        state.list.deleteItem(id);

        // Delete from the UI
        listView.deleteItem(id);

    }else if( e.target.matches('.shopping__count-value ')){

        // Update the Count Value...
        const val = parseFloat(e.target.value, 10);
        if(val > 0){
            state.list.updateCount(id, val);
        }
    }
 });


// ------------------------ Likes Controller ----------------------


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    
    // User has not yet liked Current recipe.
    
    if( !state.likes.isLiked(currentID)){

        // Add likes to the list
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle to like button
        likesView.toggleLikeBtn(true);

        // Add likes to the UI
        likesView.renderLike(newLike);


    // User has liked Current recipe.

    } else{
        // remove likes from the list
        state.likes.deleteLike(currentID);

        // Toggle to like button
        likesView.toggleLikeBtn(false);

        // remove likes from the UI
        likesView.deleteLike(currentID);

    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

// Restore liked recipes on page Load

    window.addEventListener('load', ()=>{
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

});


// ------------------------ Handling Recipe Button Clicks ----------------------

elements.recipe.addEventListener('click', e =>{

    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button click
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else  if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase button click
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add , .recipe__btn--add *')){
        // add ingredients 
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){

        // Like Controller
        controlLike();
    }
});

// ----------------- Button handel Section --------------------------


const clearAllItem = ()=>{
    listView.clearItemList();
}


document.querySelector('.itemListClear').addEventListener('click', clearAllItem)





