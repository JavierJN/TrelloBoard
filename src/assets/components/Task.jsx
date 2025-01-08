import { useSortable } from '@dnd-kit/sortable'
import React, { useEffect } from 'react'
import { CSS } from '@dnd-kit/utilities'
export const Task = ({task}) => {


  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  

  const style = React.useMemo(
      () => ({
        transition: transition || 'transform 250ms ease',
        transform: CSS.Transform.toString(transform)
      }),
      [transition, transform, isDragging]
    );

    if (isDragging) {
      return <div ref={setNodeRef} className='task-card-copy' style={style} ></div> /*Espacio drop de la tarea */
    }
  return (
    <>
    <div ref={setNodeRef}>

        <div  className="task-card" style={style} {...attributes} {...listeners}>
          {task.title}
        </div>
    </div>
      




    </>



  )
}
