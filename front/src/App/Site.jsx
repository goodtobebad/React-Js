import React, { useState, useEffect } from 'react'
import { useToggle } from '../hooks'
import { useIngredients } from '../hooks/ingredients'
import { useRecipes } from '../hooks/recipes'
import { Modal } from '../ui/Modal'
import { Ingredients } from './Ingredients/Ingredients'
import { CreateRecipeForm } from './Recipes/RecipeForm'
import { Recipe } from './Recipes/Recipe'
import { Recipes } from './Recipes/Recipes'

export function Site() {

    const [page, setPage] = useState('recipes')
    const [add, toggleAdd] = useToggle(false)
    const {
        ingredients,
        fetchIngredients,
        deleteIngredient,
        updateIngredient,
        createIngredient
    } = useIngredients()

    const {
        recipes,
        recipe,
        fetchRecipes,
        FetchRecipe,
        deselectRecipe,
        createRecipe,
        deleteRecipe,
        updateRecipe
    } = useRecipes()
    let content = null
    if (page === 'ingredients') {
        content = <Ingredients
            ingredients={ingredients}
            onDelete={deleteIngredient}
            onUpdate={updateIngredient}
            onCreate={createIngredient}
        />
    } else if (page === 'recipes') {
        content = <Recipes
            recipes={recipes}
            onClick={FetchRecipe}
        />
    }

    useEffect(function () {
        if (page === 'ingredients' || add) {
            fetchIngredients()
        }
        if (page === 'recipes') {
            fetchRecipes()
        }
    }, [page, fetchIngredients, fetchRecipes, add])

    return (
        <>
            <NavBar currentPage={page} onClick={setPage} onButtonClick={toggleAdd} />
            <div className="container">
                {recipe ? <Recipe recipe={recipe} ingredients={ingredients} onClose={deselectRecipe} onEdit={fetchIngredients} onDelete={deleteRecipe} onUpdate={updateRecipe} /> : null}
                {add && <Modal title="Créer une recette" onClose={toggleAdd}>
                    <CreateRecipeForm ingredients={ingredients} onSubmit={createRecipe} />
                </Modal>}
                {content}
            </div>
        </>
    )
}

function NavBar({ currentPage, onClick, onButtonClick }) {

    const navClass = function (page) {
        let className = 'nav-item'
        if (page === currentPage) {
            className = 'active'
        }
        return className;
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
            <a href="#recipes" className="navbar-brand" onClick={() => onClick('recipes')}>Recettes</a>
            <ul className="navbar-nav mr-auto">
                <li className={navClass('recipes')}>
                    <a href="#recipes" className="nav-link" onClick={() => onClick('recipes')}>Recettes</a>
                </li>
                <li className={navClass('ingredients')}>
                    <a href="#ingredients" className=" nav-link" onClick={() => onClick('ingredients')}>Ingrédients</a>
                </li>
            </ul>
            <button onClick={onButtonClick} className="btn btn-outline-light">Ajouter</button>
        </nav>
    )
}