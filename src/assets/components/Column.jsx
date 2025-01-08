import {  SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './Task';
import { closestCenter } from '@dnd-kit/core';

export const Column = ({ column, addTask }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const columnRef = useRef(null);
  const taskRef = useRef(null);

  const taskIds = useMemo(
    () => column.tasks.map((task) => task.id),
    [column.tasks]
  );

  const showForm = useCallback(() => setIsVisible(true), []);
  const hideForm = useCallback(() => {
    setIsVisible(false);
    setTaskTitle('');
  }, []);

  const updateTaskTitle = useCallback((event) => {
    setTaskTitle(event.target.value);
  }, []);

  const handleAddTask = useCallback(() => {
    if (taskTitle.trim()) {
      addTask(taskTitle); // Llama al método pasado por el padre
      setTaskTitle('');
      hideForm();
    } else {
      alert('El campo no puede estar vacío');
      setTaskTitle('');
    }
  }, [taskTitle, addTask, hideForm]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  useEffect(() => {
    if (!isDragging && columnRef.current) {
      const { width, height } = columnRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [isDragging]);

  const style = React.useMemo(
    () => ({
      transition: transition || 'transform 250ms ease',
      transform: CSS.Transform.toString(transform),
      ...(isDragging && {
        height: `${dimensions.height}px`,
        opacity: 0.5,
      }),
    }),
    [transition, transform, isDragging, dimensions]
  );

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        columnRef.current = node;
      }}
      style={isDragging ? { ...style, backgroundColor: '#1F2937' } : style}
      className="column"
      data-id={column.id}
    >
      {isDragging ? (
        // Renderiza un contenedor vacío durante el arrastre
        <div className="placeholder" style={{ height: dimensions.height }}></div>
      ) : (
        <>
          <h3 {...attributes} {...listeners}>
            {column.title}
          </h3>


          <SortableContext 
          collissionDetection={closestCenter} 
          strategy={verticalListSortingStrategy} 
          items={taskIds}>
            {column.tasks.map((task) => (
              <Task key={task.id} task={task}  />
            ))}
          </SortableContext>

          


          {!isVisible && (
            <div onClick={showForm} className="btn-add-task">
              + Añade una tarea
            </div>
          )}
          {isVisible && (
            <div className="form-list">
              <textarea
                value={taskTitle}
                onChange={updateTaskTitle}
                maxLength={32}
                rows={1}
                placeholder="Introduce un título"
              ></textarea>
              <div className="buttons">
                <button onClick={handleAddTask} className="btn-accept">
                  Añadir
                </button>
                <button className="btn-cancel" onClick={hideForm}>
                  X
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

};
