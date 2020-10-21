import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import { Button } from '../../ui/Button'
import { Trash, Upload } from '../../ui/Icon'
import { Apierrors } from '../../utils/api'
import { Field } from '../../ui/Field'

export function Ingredients({ ingredients, onDelete, onUpdate, onCreate }) {
    return (
        <div>
            <h1>Ingrédients</h1>
            <CreateIngredientFrom onSubmit={onCreate} />
            {ingredients === null ? <Loader /> : <IngredientsList ingredients={ingredients} onDelete={onDelete} onUpdate={onUpdate} />}
        </div>
    )
}

Ingredients.propTypes = {
    ingredients: PropTypes.array
}

function IngredientsList({ ingredients, onDelete, onUpdate }) {
    return (
        <div>
            {ingredients.map(ingredient => <Ingredient key={ingredient.id} ingredient={ingredient} onDelete={onDelete} onUpdate={onUpdate} />)}
        </div>
    )
}

const Ingredient = memo(function ({ ingredient, onDelete, onUpdate }) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const handleDelete = async function (e) {
        e.preventDefault()
        setLoading(true)
        await onDelete(ingredient)
    }
    const handleSubmit = async function (e) {
        e.preventDefault()
        setErrors([])
        setLoading(true)
        try {
            await onUpdate(ingredient, new FormData(e.target))
        } catch (e) {
            if (e instanceof Apierrors) {
                setErrors(e.errorsPerField)
            } else {
                throw e
            }
        }
        setLoading(false)
    }

    return (
        <form className='d-flex align-items-start' onSubmit={handleSubmit}>
            <Field defaultValue={ingredient.title} name='title' className='mr-2' error={errors.title} />
            <Field defaultValue={ingredient.unit} name='unit' className='mr-2' error={errors.unit} />
            <Button type='submit' loading={loading}><Upload /></Button>
            <Button type='danger' onClick={handleDelete} loading={loading}><Trash /></Button>
        </form>
    )
})

function CreateIngredientFrom({ onSubmit }) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const handleSubmit = async function (e) {
        const form = e.target
        e.preventDefault()
        setErrors([])
        setLoading(true)
        try {
            await onSubmit(new FormData(form))
            form.reset()
            form.querySelector('input').focus()
        } catch (e) {
            if (e instanceof Apierrors) {
                setErrors(e.errorsPerField)
            } else {
                throw e
            }
        }
        setLoading(false)
    }

    return (
        <form className='d-flex align-items-start' onSubmit={handleSubmit}>
            <Field placeholder="nom de l'ingrédient" name='title' className='mr-2' error={errors.title} />
            <Field placeholder='Unité de mesure' name='unit' className='mr-2' error={errors.unit} />
            <Button type='submit' loading={loading}>Créer</Button>
        </form>
    )
}