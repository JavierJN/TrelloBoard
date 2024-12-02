import React from 'react';
import {DndContext} from '@dnd-kit/core';
import { AddColumn } from './assets/components/AddColumn';




function App() {


  return (
    
    <div className='layout'>
      { /*Cargando toda la configuracion de rutas */}

      <div className="nav">
        Nav bar
      </div>

      <div className="content">
      <DndContext >
        <AddColumn/>
      </DndContext>
      </div>



      <div className="footer">
        Footer
      </div>
    </div>


  )
}

export default App
