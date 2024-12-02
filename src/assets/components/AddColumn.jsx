import React from 'react'
import { Add } from '../icons/Add'
import { X } from '../icons/X'


export const AddColumn = () => {
  return (
    <>
    
    <div className='form-list'>
      <textarea  maxLength={512} rows={1}  placeholder='Introduce el nombre de la lista'></textarea>
      <div className='button'>
        <button>Añadir lista</button>
        <button><X/></button>
      </div>
      <div>

      </div>
    </div>
    <div className='btn-column'> <Add/>Añade otra lista</div>

    
    </>
    
  )
}
