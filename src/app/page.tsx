import TodoList from './components/TodoList';
import { Todo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const todos: Todo[] = await response.json();
    // Format dates on the server
    return todos.map(todo => ({
      ...todo,
      createdAtFormatted: new Date(todo.createdAt).toLocaleString(),
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

export default async function HomePage() {
  const initialTodos = await fetchTodos();
  return <TodoList initialTodos={initialTodos} />;
}