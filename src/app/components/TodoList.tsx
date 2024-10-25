"use client";

import { useState } from 'react';
import axios from 'axios';
import { Todo } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description };

    if (isEditing && editId !== null) {
      try {
        const response = await axios.put(`${API_URL}/todos/${editId}`, payload);
        setTodos((prev) =>
          prev.map((todo) => (todo.id === editId ? response.data : todo))
        );
      } catch (error) {
        console.error("Error updating todo:", error);
      }
      setIsEditing(false);
      setEditId(null);
    } else {
      try {
        const response = await axios.post(`${API_URL}/todos`, payload);
        setTodos((prev) => [...prev, response.data]);
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(true);
    setEditId(todo.id);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {isEditing ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="border p-4 mb-2">
            <h3 className="font-bold text-xl">{todo.title}</h3>
            <p>{todo.description}</p>
            <p className="text-gray-500">Created at: {todo.createdAtFormatted}</p>
            <button onClick={() => handleEdit(todo)} className="text-blue-500 mr-2">
              Edit
            </button>
            <button onClick={() => handleDelete(todo.id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}