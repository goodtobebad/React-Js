import React from 'react'

export function Loader({ size }) {

    let className = 'spinner-border spinner-border-' + size

    return (
        <div className={className} role='status'>
            <span className='sr-only'>Chargement...</span>
        </div>
    )
}