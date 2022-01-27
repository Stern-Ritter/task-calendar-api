import { Task } from "./Task";

export default abstract class TasksCalendar {
  abstract getAll(): any;

  abstract getById(id: number): any;

  abstract create(task: Task): any;

  abstract update(task: Task): any;

  abstract delete(id: number): any;
}
