import Task from "./Task";

export default class TasksCalendar {
  async getAll(): Promise<any> {}
  async getById(id: number): Promise<any> {}
  async create(task: Task): Promise<any> {}
  async update(task: Task): Promise<any> {}
  async delete(id: number): Promise<any> {}
}
