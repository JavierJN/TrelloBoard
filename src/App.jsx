import React from 'react';
import {DndContext} from '@dnd-kit/core';




function App() {


  return (
    
    <div className='layout'>
      { /*Cargando toda la configuracion de rutas */}

      <div className="nav">
        Nav bar
      </div>

      <div className="content">
      <DndContext>
        
      </DndContext>
      </div>



      <div className="footer">
        Footer
      </div>
    </div>


  )
}

export default App
