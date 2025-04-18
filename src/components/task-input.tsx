'use client';

import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';

interface Task {
  description: string;
  priority: 'high' | 'medium' | 'low';
  duration: number;
  constraints: string;
}

interface TaskInputProps {
  onTaskSubmit: (tasks: Task[]) => void;
}

export function TaskInput({onTaskSubmit}: TaskInputProps) {
  const {toast} = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task>({
    description: '',
    priority: 'medium',
    duration: 30,
    constraints: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setTask({...task, [name]: value});
  };

  const handlePriorityChange = (value: string) => {
    setTask({...task, priority: value as 'high' | 'medium' | 'low'});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add the current task to the tasks array
    setTasks([...tasks, task]);
    toast({
      title: 'Task Added',
      description: `Task "${task.description}" added with priority ${task.priority}.`,
    });
    // Reset the form
    setTask({description: '', priority: 'medium', duration: 30, constraints: ''});
  };

  const handleGenerateSchedule = () => {
    if (tasks.length === 0) {
      toast({
        title: 'No Tasks Added',
        description: 'Please add tasks to generate a schedule.',
        variant: 'destructive',
      });
      return;
    }
    onTaskSubmit(tasks);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Task description"
            required
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select onValueChange={handlePriorityChange} defaultValue={task.priority}>
          <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            value={task.duration}
            onChange={handleChange}
            placeholder="Duration in minutes"
            required
          />
        </div>
        <div>
          <Label htmlFor="constraints">Constraints</Label>
          <Textarea
            id="constraints"
            name="constraints"
            value={task.constraints}
            onChange={handleChange}
            placeholder="e.g., Only in the morning"
          />
        </div>
        <Button type="submit">Add Task</Button>
      </form>
      <Button className="mt-4" onClick={handleGenerateSchedule}>
        Generate Schedule
      </Button>
    </>
  );
}
