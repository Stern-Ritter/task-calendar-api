export default class Task {
  readonly id: number; // task id
  public name: string; // name of task
  public createdDate: number; // when the task was created
  public eventDate: number; // when task is set to be due, in milliseconds
  public category: string;
  public tags: string[];
  public state: string;
  public description: string;

  constructor(options: TaskOptions) {
    const { id, name, createdDate, eventDate, category, tags, state, description } = options;
    this.id = typeof id !== 'undefined' ? id : -1;
    this.name = name;
    this.createdDate = createdDate;
    this.eventDate = eventDate;
    this.category = category;
    this.tags = tags;
    this.state = state;
    this.description = description;
  }
}

type TaskOptions = {
  id?: number;
  name: string;
  createdDate: number;
  eventDate: number;
  category: string;
  tags: string[];
  state: string;
  description: string;
}
