import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getFilteredTasks(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;
    let tasks = this.tasks;

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(taskId: string): Task {
    const task = this.tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new NotFoundException(`Task with id "${taskId}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(taskId: string): void {
    // const TASK = this.tasks.find((task) => task.id === taskId);
    const found = this.getTaskById(taskId);

    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  patchTask(id: string, taskStatus: TaskStatus) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    const taskToUpdate = { ...this.getTaskById(id) };
    taskToUpdate.status = taskStatus;
    this.tasks[taskIndex] = taskToUpdate;

    return this.tasks;
  }
}
