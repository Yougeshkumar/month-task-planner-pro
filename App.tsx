import React, { useState } from 'react';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

type Category = 'To Do' | 'In Progress' | 'Review' | 'Completed';

interface Task {
  id: string;
  name: string;
  category: Category;
  start: Date;
  end: Date;
}

const categories: Category[] = ['To Do', 'In Progress', 'Review', 'Completed'];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>('To Do');

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const toggleDay = (day: Date) => {
    setSelectedDays((prev) =>
      prev.find((d) => d.getTime() === day.getTime())
        ? prev.filter((d) => d.getTime() !== day.getTime())
        : [...prev, day]
    );
  };

  const addTask = () => {
    if (selectedDays.length === 0 || !newTaskName) return;
    const sorted = selectedDays.sort((a, b) => a.getTime() - b.getTime());
    const task: Task = {
      id: Math.random().toString(36).slice(2),
      name: newTaskName,
      category: newTaskCategory,
      start: sorted[0],
      end: sorted[sorted.length - 1],
    };
    setTasks((prev) => [...prev, task]);
    setSelectedDays([]);
    setNewTaskName('');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Month Task Planner</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginTop: '20px' }}>
        {days.map((day) => {
          const isSelected = selectedDays.find((d) => d.getTime() === day.getTime());
          return (
            <div
              key={day.toISOString()}
              onClick={() => toggleDay(day)}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                background: isSelected ? '#a5d8ff' : '#f8f9fa',
                cursor: 'pointer',
              }}
            >
              {format(day, 'd')}
              <div style={{ fontSize: '10px' }}>
                {tasks.filter((t) => day >= t.start && day <= t.end).map((t) => (
                  <div key={t.id} style={{ background: '#74c0fc', margin: '2px 0', padding: '2px' }}>{t.name}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value as Category)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
