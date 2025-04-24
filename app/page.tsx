"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";

type TaskStatus = "pending" | "in-progress" | "completed";

interface Task {
  id: string;
  text: string;
  status: TaskStatus;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("pending");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter tasks by status
  const pendingTasks = tasks.filter((task: Task) => task.status === "pending");
  const inProgressTasks = tasks.filter(
    (task: Task) => task.status === "in-progress"
  );
  const completedTasks = tasks.filter(
    (task: Task) => task.status === "completed"
  );

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      status: newTaskStatus,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
    setNewTaskStatus("pending");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editTask || editTask.text.trim() === "") return;

    setTasks(tasks.map((task) => (task.id === editTask.id ? editTask : task)));
    setIsEditDialogOpen(false);
    setEditTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-500 my-8">
        Todo-List App
      </h1>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-8">
        <div className="space-y-4">
          <Input
            placeholder="Enter your task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />

          <Select
            value={newTaskStatus}
            onValueChange={(value) => setNewTaskStatus(value as TaskStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Task Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center">
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500"
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {/* Pending Tasks */}
        <TaskColumn
          title="Pending Tasks"
          tasks={pendingTasks}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
          bgColor="from-red-400 to-pink-400"
          emptyMessage="No pending tasks. Add one above!"
        />

        {/* In Progress Tasks */}
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
          bgColor="from-yellow-400 to-orange-400"
          emptyMessage="No tasks in progress"
        />

        {/* Completed Tasks */}
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
          bgColor="from-blue-400 to-green-400"
          emptyMessage="No completed tasks yet"
        />
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Update your task..."
              value={editTask?.text || ""}
              onChange={(e) =>
                setEditTask((prev) =>
                  prev ? { ...prev, text: e.target.value } : null
                )
              }
            />

            <Select
              value={editTask?.status}
              onValueChange={(value) =>
                setEditTask((prev) =>
                  prev ? { ...prev, status: value as TaskStatus } : null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Task Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  bgColor: string;
  emptyMessage: string;
}

function TaskColumn({
  title,
  tasks,
  onDelete,
  onEdit,
  bgColor,
  emptyMessage,
}: TaskColumnProps) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-4">
      <div
        className={`bg-gradient-to-r ${bgColor} text-white rounded-md p-2 mb-4 flex justify-between items-center`}
      >
        <h2 className="font-semibold">{title}</h2>
        <span className="bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-md p-3 shadow-sm flex justify-between items-center group"
            >
              <p className="text-gray-800 break-words flex-1">{task.text}</p>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button onClick={() => onEdit(task)} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <SidebarMenuSubButton
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </SidebarMenuSubButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
