import { Task } from "./Task";
import TasksCalendar from "./TasksCalendar";

export default class LocalStorageTasksCalendar extends TasksCalendar {
  private storageKey: string;

  private counter: number;

  constructor(storageKey = "calendar-data") {
    super();
    this.storageKey = storageKey;
    this.counter = 0;
  }

  async getAll(): Promise<Task[]> {
    return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
  }

  async getAllWithFilter(option: Partial<Task>): Promise<Task[]> {
    const tasksState = await this.getAll();
    const filters = Object.entries(option);
    return tasksState.filter((taskInstance) => filters.every(([key, value]) => {
      if(Array.isArray(value)) {
        return value.every((el) => taskInstance[key].includes(el));
      }
      return taskInstance[key] === value;
    }));
  }

  async getById(id: number): Promise<Task | null> {
    const tasksState = await this.getAll();
    const existedTask = tasksState.find(
      (taskInstance) => taskInstance.id === id
    );
    return typeof existedTask !== "undefined" ? existedTask : null;
  }

  async create(task: Task): Promise<boolean> {
    const tasksState = await this.getAll();
    const tasksId = tasksState.map((taskInstance) => taskInstance.id);
    if (!tasksId.includes(task.id)) {
      this.counter += 1;
      const newTasksState = [...tasksState, { ...task, id: this.counter }];
      localStorage.setItem(this.storageKey, JSON.stringify(newTasksState));
      return true;
    }
    return false;
  }

  async update(task: Task): Promise<boolean> {
    const tasksState = await this.getAll();
    const existedTask = tasksState
      .find((taskInstance) => taskInstance.id === task.id);
    if (typeof existedTask !== "undefined") {
      const newTasksState = [...tasksState]
        .map((taskInstance) => taskInstance.id === task.id ? task : taskInstance);
      localStorage.setItem(this.storageKey,JSON.stringify(newTasksState));
      return true;
    }
    return false;
  }

  async delete(id: number): Promise<boolean> {
    const tasksState = await this.getAll();
    const existedTask = tasksState
      .find((taskInstance) => taskInstance.id === id);
    if (typeof existedTask !== "undefined") {
      const newTasksState = [...tasksState].filter((taskInstance) => taskInstance.id !== id);
      localStorage.setItem(this.storageKey,JSON.stringify(newTasksState));
      return true;
    }
    return false;
  }
}
