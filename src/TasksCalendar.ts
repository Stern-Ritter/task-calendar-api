import { Task } from "./Task";

export default abstract class TasksCalendar {
  abstract getAll(): any;
  abstract getAllWithFilter(option: Partial<Task>): any;
  abstract getById(id: string): any;
  abstract create(task: Task): any;
  abstract update(task: Task): any;
  abstract delete(id: string): any;
  abstract deleteAll(): any;
}
