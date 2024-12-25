import React, { useEffect, useState } from 'react';
import {DndContext} from '@dnd-kit/core';
import { AddColumn } from './assets/components/AddColumn';
import '@fontsource-variable/onest';
import { Column } from './assets/components/Column';




function App() {

  const [columns, setColumns] = useState([]);

  function createColumn(title) {
      const newColumn = {
        id: Date.now().toString(),  // Asignar ID basado en la longitud actual de la lista
        title: title, 
        tasks: [] // Nombre de la lista
      };
      setColumns([...columns, newColumn]);  //Agrega una nueva lista al array de listas
    }

    useEffect(() => {
      console.log(columns);
    }, [columns])
    

  return (
    
    <div className='layout'>
      { /*Cargando toda la configuracion de rutas */}

      <div className="nav">
        Nav bar
      </div>

      <div className="content">
      <DndContext >
        {columns.map(column => (
          <Column key={column.id} column={column}/>
        ))}
        <AddColumn createColumn={createColumn}/>
      </DndContext>
      </div>



      <div className="footer">
        Footer
      </div>
    </div>


  )
}

export default App
