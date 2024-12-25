import React from 'react'

export const Column = ({column}) => {
  return (
    <div className="column">
      <h3>{column.title}</h3>
      <ul>
        {column.tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  )
}
