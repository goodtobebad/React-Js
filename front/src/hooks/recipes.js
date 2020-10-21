import { useCallback, useReducer } from "react"
import { apiFetch } from "../utils/api"

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_RECIPES':
            return { ...state, loading: true }
        case 'SET_RECIPES':
            return { ...state, loading: false, recipes: action.payload }
        case 'SET_RECIPE':
            return {
                ...state,
                recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r)
            }
        case 'FETCH_RECIPE':
            return { ...state, recipeId: action.payload.id }
        case 'DESELECT_RECIPE':
            return { ...state, recipeId: null }
        case 'ADD_RECIPE':
            return { ...state, recipes: [action.payload, ...state.recipes] }
        case 'DELETE_RECIPE':
            return { ...state, recipes: state.recipes.filter(r => r !== action.payload) }
        default:
            throw new Error('action inconnu ' + action.payload)
    }
}

export function useRecipes() {
    const [state, dispatch] = useReducer(reducer, {
        laoding: false,
        recipes: null,
        recipeId: null
    })

    const recipe = state.recipes ? state.recipes.find(r => r.id === state.recipeId) : null

    return {
        recipes: state.recipes,
        recipe: recipe,
        fetchRecipes: async function () {
            if (state.loading || state.recipes !== null) {
                return
            }
            dispatch({ type: 'FETCH_RECIPES' })
            const recipes = await apiFetch('/recipes')
            dispatch({ type: 'SET_RECIPES', payload: recipes })
        },
        FetchRecipe: useCallback(async function (recipe) {
            dispatch({ type: 'FETCH_RECIPE', payload: recipe })
            if (!recipe.ingredients) {
                recipe = await apiFetch('/recipes/' + recipe.id)
                dispatch({ type: 'SET_RECIPE', payload: recipe })
            }
        }, []),
        deselectRecipe: async function () {
            dispatch({ type: "DESELECT_RECIPE" })
        },
        createRecipe: useCallback(async function (data) {
            const recipe = await apiFetch('/recipes', {
                method: 'POST',
                body: data
            })
            dispatch({ type: 'ADD_RECIPE', payload: recipe })
        }, []),
        updateRecipe: useCallback(async function (recipe, data) {
            recipe = await apiFetch('/recipes/' + recipe.id, {
                method: 'PUT',
                body: data
            })
            dispatch({ type: 'SET_RECIPE', payload: recipe })
        }, []),
        deleteRecipe: useCallback(async function (recipe) {
            await apiFetch('/recipes/' + recipe.id, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE_RECIPE', payload: recipe })
        }, [])
    }
}