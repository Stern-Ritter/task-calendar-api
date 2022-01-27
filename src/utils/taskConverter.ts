import { Task } from "../Task";

const taskConverter = {
  toFirestore: (task: Task) => ({
      name: task.name,
      createdDate: task.createdDate,
      eventDate: task.eventDate,
      category: task.category,
      tags: task.tags,
      state: task.state,
      description: task.description
    }
  ),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new Task({
      id: snapshot.id,
      name: data.name,
      createdDate: data.createdDate,
      eventDate: data.eventDate,
      category: data.category,
      tags: data.tags,
      state: data.state,
      description: data.description
    });
  }
}

export { taskConverter };
