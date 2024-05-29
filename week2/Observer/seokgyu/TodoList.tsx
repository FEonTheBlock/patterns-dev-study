import React, { useState, useEffect } from 'react';

import { type TodoItem, type Subscriber } from './TodoStore';

import todoStore from './TodoStore';

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>(todoStore.getTodos());
  const [value, setValue] = useState('');

  useEffect(() => {
    const handleTodosChange = (newTodos: TodoItem[]) => {
      setTodos(newTodos);
    };

    todoStore.subscribe(handleTodosChange);

    return () => {
      todoStore.unsubscribe(handleTodosChange);
    };
  }, []);

  const handleAddTodo = () => {
    const newTodo = { content: value, id: `${todos.length - 1}` };

    if (newTodo) {
      todoStore.addTodo(newTodo);
    }
  };

  const handleRemoveTodo = (id: string) => {
    todoStore.removeTodo(id);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>
            {content}
            <button onClick={() => handleRemoveTodo(id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
};

export default TodoList;
