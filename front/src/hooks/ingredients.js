import { useCallback, useReducer } from 'react'
import { apiFetch } from '../utils/api'

function reducer(state, action) {
    switch (action.type) {
        case 'FETCHING_INGREDIENTS':
            return { ...state, loading: true }
        case 'SET_INGREDIENTS':
            return { ...state, ingredients: action.payload, loading: false }
        case 'DELETE_INGREDIENT':
            return { ...state, ingredients: state.ingredients.filter(i => i !== action.payload) }
        case 'ADD_INGREDIENT':
            return { ...state, ingredients: [action.payload, ...state.ingredients] }
        case 'UPDATE_INGREDIENT':
            return { ...state, ingredients: state.ingredients.map(i => i === action.target ? action.payload : i) }
        default:
            throw new Error('action inconnue ' + action.type)
    }
}

export function useIngredients() {
    const [state, dispatch] = useReducer(reducer, {
        ingredients: null,
        loading: false
    })

    return {
        ingredients: state.ingredients,
        fetchIngredients: useCallback(async function () {
            if (state.laoding || state.ingredients) {
                return;
            }
            dispatch({ type: 'FETCHING_INGREDIENTS' })
            const ingredients = await apiFetch('/ingredients')
            dispatch({ type: 'SET_INGREDIENTS', payload: ingredients })
        }, [state]),
        deleteIngredient: useCallback(async function (ingredient) {
            await apiFetch('/ingredients/' + ingredient.id, {
                method: 'GET'
            })
            dispatch({ type: "DELETE_INGREDIENT", payload: ingredient })
        }, []),
        updateIngredient: useCallback(async function (ingredient, data) {
            const newIngredient = await apiFetch('/ingredients/' + ingredient.id, {
                method: 'PUT',
                body: data
            })
            dispatch({ type: 'UPDATE_INGREDIENT', payload: newIngredient, target: ingredient })
        }, []),
        createIngredient: useCallback(async function (data) {
            const newIngredient = await apiFetch('/ingredients/', {
                method: 'POST',
                body: data
            })
            dispatch({ type: 'ADD_INGREDIENT', payload: newIngredient })
        }, [])
    }

}