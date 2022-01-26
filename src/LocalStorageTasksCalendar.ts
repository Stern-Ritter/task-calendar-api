import Task from "./Task";
import TasksCalendar from "./TasksCalendar";

class LocalStorageTasksCalendar extends TasksCalendar {
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

  async getById(id: number): Promise<Task | null> {
    const tasksState = await this.getAll();
    const existedTask = tasksState.find(
      (taskInstance) => taskInstance.id === id
    );
    if (typeof existedTask !== "undefined") {
      return existedTask;
    } else {
      return null;
    }
  }

  async create(task: Task): Promise<boolean> {
    const tasksState = await this.getAll();
    const tasksId = tasksState.map((taskInstance) => taskInstance.id);
    if (!tasksId.includes(task.id)) {
      const newTasksState = [...tasksState, { ...task, id: ++this.counter }];
      localStorage.setItem(this.storageKey, JSON.stringify(newTasksState));
      return true;
    } else {
      return false;
    }
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
    } else {
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    const tasksState = await this.getAll();
    const existedTask = tasksState
      .find((taskInstance) => taskInstance.id === id);
    if (typeof existedTask !== "undefined") {
      const newTasksState = [...tasksState].filter((taskInstance) => taskInstance.id !== id);
      localStorage.setItem(this.storageKey,JSON.stringify(newTasksState));
      return true;
    } else {
      return false;
    }
  }
}
