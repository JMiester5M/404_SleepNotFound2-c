// API route for task management
import fs from 'fs';
import path from 'path';

const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');

// Helper to read tasks from file
function readTasks() {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to write tasks to file
function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all tasks
      const tasks = readTasks();
      return res.status(200).json(tasks);

    case 'POST':
      // Create a new task
      try {
        const newTask = req.body;
        const tasks = readTasks();
        
        // Add ID and timestamp
        newTask.id = Date.now();
        newTask.createdAt = new Date().toISOString();
        
        tasks.unshift(newTask);
        writeTasks(tasks);
        
        return res.status(201).json(newTask);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create task' });
      }

    case 'PUT':
      // Update a task
      try {
        const updatedTask = req.body;
        let tasks = readTasks();
        
        const index = tasks.findIndex(t => t.id === updatedTask.id);
        if (index === -1) {
          return res.status(404).json({ error: 'Task not found' });
        }
        
        tasks[index] = { ...tasks[index], ...updatedTask };
        writeTasks(tasks);
        
        return res.status(200).json(tasks[index]);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update task' });
      }

    case 'DELETE':
      // Delete a task
      try {
        const { id } = req.query;
        let tasks = readTasks();
        
        tasks = tasks.filter(t => t.id !== parseInt(id));
        writeTasks(tasks);
        
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete task' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
