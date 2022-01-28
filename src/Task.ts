const taskStates = [
  "to do",
  "done",
] as const;

type TaskState = typeof taskStates[number];

type TaskOptions = {
  id?: string;
  name: string;
  createdDate: number;
  eventDate: number;
  category: string;
  tags: string[];
  state: TaskState;
  description: string;
}

class Task {
  readonly id: string;
  public name: string;

  public createdDate: number;

  public eventDate: number;

  public category: string;

  public tags: string[];

  public state: string;

  public description: string;

  constructor(options: TaskOptions) {
    const { id, name, createdDate, eventDate, category, tags, state, description } = options;
    this.id = typeof id !== 'undefined' ? id : "";
    this.name = name;
    this.createdDate = createdDate;
    this.eventDate = eventDate;
    this.category = category;
    this.tags = tags;
    this.state = state;
    this.description = description;
  }
}

export { Task, TaskOptions, taskStates};
