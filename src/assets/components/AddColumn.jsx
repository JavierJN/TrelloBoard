import React, { useEffect, useState } from 'react';

export const AddColumn = ({createColumn}) => {

  
  const [columnTitle, setColumnTitle] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const showForm = () => setIsVisible(true);
  const hideForm = () => {
    setIsVisible(false);
    setColumnTitle('');
  };



  const handleAddColumn = () => {
    if (columnTitle.trim()) {
      createColumn(columnTitle);
      setColumnTitle('');
      hideForm();
    } else {
      alert('El campo no puede estar vacio');
      setColumnTitle('');
    }
  }

  
 
  const updateTitle = (event) => {
    setColumnTitle(event.target.value);
  }
   


  return (
    <>

      {!isVisible && (<div onClick={showForm} className='btn-column'> + Añadir columna</div>)}

      {isVisible && (
        <div className='form-list'>
          <textarea value={columnTitle} onChange={updateTitle}  maxLength={32} rows={1} placeholder='Titulo de la lista'></textarea>
          <div className='buttons'>
            <button className='btn-accept' onClick={handleAddColumn}>Añadir</button>
            <button className='btn-cancel' onClick={hideForm}>X</button>
          </div>
          <div>

          </div>
        </div>
      )}
    </>

  )
}
