import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import { Modal } from '../../ui/Modal'
import { useToggle } from '../../hooks'
import { EditRecipeForm } from './RecipeForm'
import { Button } from '../../ui/Button'

export function Recipe({ recipe, onClose, onEdit, ingredients, onUpdate, onDelete }) {
    return (
        <Modal title={recipe.title} onClose={onClose}>
            {!recipe.ingredients ?
                <Loader /> :
                <RecipeDetail recipe={recipe} ingredients={ingredients} onEdit={onEdit} onUpdate={onUpdate} />
            }
            <Button type="danger" onClick={() => onDelete(recipe)}>Supprimer</Button>
        </Modal>

    )
}
Recipe.propTypes = {
    recipe: PropTypes.object.isRequired
}

function RecipeDetail({ recipe, ingredients, onEdit, onUpdate }) {
    const [editMode, toggleEditMode] = useToggle(false)
    const htmlContent = { __html: recipe.content.split("\n").join('</br>') }

    const handleUpdate = async function (data) {
        await onUpdate(recipe, data)
        toggleEditMode()
    }

    const handleEditMode = function () {
        toggleEditMode()
        onEdit()
    }

    return (
        editMode ? <EditRecipeForm
            recipe={recipe}
            ingredients={ingredients}
            onSubmit={handleUpdate}
        /> :
            <>
                <div dangerouslySetInnerHTML={htmlContent}></div>
                <h4 className="mt-4">Ingrédients</h4>
                <ul>
                    {recipe.ingredients.map(ingredient =>
                        <IngredientRow ingredient={ingredient} key={ingredient.id} />
                    )}
                </ul>
                <button onClick={handleEditMode}>Editer</button>
            </>
    )
}

function IngredientRow({ ingredient }) {

    return (
        <li>
            <strong>{ingredient.quantity} {ingredient.unit}</strong> {ingredient.title}
        </li>
    )
}