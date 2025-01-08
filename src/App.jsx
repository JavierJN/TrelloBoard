import React, { useEffect, useMemo, useState } from 'react';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { AddColumn } from './assets/components/AddColumn';
import '@fontsource-variable/onest';
import { Column } from './assets/components/Column';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Task } from './assets/components/Task';

function App() {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  const [activeItem, setActiveItem] = useState(null); // Estado para saber si algun colum/itme es arrastrado

  // Método para crear columnas
  function createColumn(title) {
    const newColumn = {
      id: Date.now().toString(),
      title: title,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  }

  // Método para agregar una tarea a una columna específica
  const addTaskToColumn = (columnId, taskTitle) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
            ...col,
            tasks: [...col.tasks, { id: Date.now().toString(), title: taskTitle, columnId }],
          }
          : col
      )
    );
  };


  function onDragStart(event) {

    //Funcion para saber que item esta siendo activado
    if (event.active.data.current.task) {
      const item = event.active.data.current.task;
      setActiveItem({ type: "task", item: item });
      /*console.log("Arrastrando tarea");*/
      /*console.log(item);*/
    } else {
      const item = event.active.data.current.column;
      setActiveItem({ type: "column", item: item });
      /*console.log("Arrastrando columna");*/
      /*console.log(item);*/
    }

  }

  /*
  useEffect(() => {
    console.log(activeItem);
  }, [activeItem]);*/




  function onDragEnd(event) {
    setActiveItem(null);

    const { active, over } = event;
    if (!over) {
      setActiveItem(null);
      return;
    }


    const activeColumnId = active.id;
    const overColumnId = over.id;

    // Condicion para saber si el item es una columna
    if (event.active.data.current.column) {
      /*console.log("Estoy sobre:")*/
      /*console.log(over.data.current.column);*/
      if (activeColumnId === overColumnId) {//Condicion para saber si la columna es la misma
        setActiveItem(null);
        return; //Si la columna es la misma no se hace nada
      }

      //Si la columna es diferente se hace el cambio de posicion
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
        const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      setActiveItem(null);
    }


  }
  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    console.log("Estás interactuando con algo");
    console.log("active");
    console.log(active);
    console.log("over");
    console.log(over);
  
    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";
  
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
  
      // Caso 1: Tarea sobre otra tarea
      if (isActiveTask && isOverTask) {
        const sourceColumnId = active.data.current.task.columnId;
        const targetColumnId = over.data.current.task.columnId;
  
        const sourceColumnIndex = newColumns.findIndex(
          (col) => col.id === sourceColumnId
        );
        const targetColumnIndex = newColumns.findIndex(
          (col) => col.id === targetColumnId
        );
  
        const activeTaskIndex = newColumns[sourceColumnIndex].tasks.findIndex(
          (task) => task.id === active.data.current.task.id
        );
        const overTaskIndex = newColumns[targetColumnIndex].tasks.findIndex(
          (task) => task.id === over.data.current.task.id
        );
  
        // Caso 1.1: Dentro de la misma columna
        if (sourceColumnId === targetColumnId) {
          const updatedTasks = arrayMove(
            newColumns[sourceColumnIndex].tasks,
            activeTaskIndex,
            overTaskIndex
          );
  
          newColumns[sourceColumnIndex] = {
            ...newColumns[sourceColumnIndex],
            tasks: updatedTasks,
          };
        }
  
        // Caso 1.2: Entre diferentes columnas
        else {
          const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(
            activeTaskIndex,
            1
          );
          newColumns[targetColumnIndex].tasks.splice(overTaskIndex, 0, movedTask);
  
          // Actualiza el columnId de la tarea movida
          movedTask.columnId = targetColumnId;
  
          newColumns[sourceColumnIndex] = {
            ...newColumns[sourceColumnIndex],
          };
          newColumns[targetColumnIndex] = {
            ...newColumns[targetColumnIndex],
          };
        }
      }
  
      // Caso 2: Tarea sobre una columna vacía
      if (isActiveTask && isOverColumn) {
        const sourceColumnId = active.data.current.task.columnId;
        const targetColumnId = over.id;
  
        const sourceColumnIndex = newColumns.findIndex(
          (col) => col.id === sourceColumnId
        );
        const targetColumnIndex = newColumns.findIndex(
          (col) => col.id === targetColumnId
        );
  
        const activeTaskIndex = newColumns[sourceColumnIndex].tasks.findIndex(
          (task) => task.id === active.data.current.task.id
        );
  
        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(
          activeTaskIndex,
          1
        );
        newColumns[targetColumnIndex].tasks.push(movedTask);
  
        // Actualiza el columnId de la tarea movida
        movedTask.columnId = targetColumnId;
  
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
        };
        newColumns[targetColumnIndex] = {
          ...newColumns[targetColumnIndex],
        };
      }
  
      return newColumns;
    });
  }
  
  

  return (
    <div className="layout">
      <div className="nav">
        <h1>
        Kanban Board | Dnd Kit 
        </h1>
         </div>
      <div className="content">
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <SortableContext
            items={columnsId}
            strategy={horizontalListSortingStrategy}
            collisionDetection={closestCenter}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                addTask={(taskTitle) => addTaskToColumn(column.id, taskTitle)}
              />
            ))}
          </SortableContext>

          <AddColumn createColumn={createColumn} />

          {createPortal(
            <DragOverlay>
              {activeItem && activeItem.type === "column" && <Column column={activeItem.item} />}
              {activeItem && activeItem.type === "task" && <Task task={activeItem.item} />}

            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      <div className="footer">© 2025 Javier | Todos los derechos reservados</div>
    </div>
  );
}

export default App;
