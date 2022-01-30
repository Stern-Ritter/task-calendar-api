import FirebaseTasksCalendar from "./FirebaseTasksCalendar";
import { Task, TaskOptions } from "./Task";
import { firebaseConfig } from "./utils/config";

let storage: FirebaseTasksCalendar;
const collectionName = "calendar-tasks";

describe("LocalStorageTasksCalendar", () => {
  beforeAll(() => {
    storage = new FirebaseTasksCalendar(firebaseConfig, collectionName);
  });

  afterAll(async () => {
    await storage.close();
  });

  beforeEach(async () => {
    await storage.deleteAll();
  });

  it(`method getAll() return empty array if
  method create() has never been called yet`, async () => {
    const tasks = await storage.getAll();
    expect(tasks).toStrictEqual([]);
  });

  it(`method getAll() return correct values`, async () => {
    const elements: TaskOptions[] = [
      {
        name: "first task",
        createdDate: 1643273967854,
        eventDate: 1643274544153,
        category: "first category",
        tags: ["first", "second", "third"],
        state: "to do",
        description: "first description",
      },
      {
        name: "second task",
        createdDate: 1643273967860,
        eventDate: 1643274544163,
        category: "second category",
        tags: ["second", "third"],
        state: "done",
        description: "second description",
      },
      {
        name: "third task",
        createdDate: 1643273967954,
        eventDate: 1643274544253,
        category: "third category",
        tags: ["third"],
        state: "to do",
        description: "third description",
      }
    ];

    const operations: Promise<string>[] = [];
    elements.forEach((element) => {
      const taskObj = new Task(element);
      operations.push(storage.create(taskObj) as Promise<string>);
    });
    const results = await Promise.all(operations);
    results.forEach((id, idx) => { elements[idx].id = id });

    const tasks = await storage.getAll();
    elements.forEach((expectedTask) => {
        expect(tasks).toContainEqual(expectedTask);
      });
  });

  it("method getAllWithFilter() return correct value", async () => {
    const elements: TaskOptions[] = [
      {
        name: "first task",
        createdDate: 1643273967854,
        eventDate: 1643274544153,
        category: "first category",
        tags: ["first", "second"],
        state: "to do",
        description: "first description",
      },
      {
        name: "second task",
        createdDate: 1643273967860,
        eventDate: 1643274544163,
        category: "second category",
        tags: ["second", "third"],
        state: "done",
        description: "second description",
      },
      {
        name: "third task",
        createdDate: 1643273967854,
        eventDate: 1643274544163,
        category: "first category",
        tags: ["third"],
        state: "done",
        description: "third description",
      }
    ];

    const operations: Promise<string>[] = [];
    elements.forEach((element) => {
      const taskObj = new Task(element);
      operations.push(storage.create(taskObj) as Promise<string>);
    });
    const results = await Promise.all(operations);
    results.forEach((id, idx) => { elements[idx].id = id });

    let tasks = await storage.getAllWithFilter({description: "second description"}) as Task[];
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(elements[1]);

    tasks = await storage.getAllWithFilter({createdDate: 1643273967854}) as Task[];
    expect(tasks).toHaveLength(2);
    expect(tasks).toContainEqual(elements[0]);
    expect(tasks).not.toContainEqual(elements[1]);
    expect(tasks).toContainEqual(elements[2]);

    tasks = await storage.getAllWithFilter({state: "done"}) as Task[];
    expect(tasks).toHaveLength(2);
    expect(tasks).not.toContainEqual(elements[0]);
    expect(tasks).toContainEqual(elements[1]);
    expect(tasks).toContainEqual(elements[2]);

    tasks = await storage.getAllWithFilter({tags: ["second"]}) as Task[];
    expect(tasks).toHaveLength(2);
    expect(tasks).toContainEqual(elements[0]);
    expect(tasks).toContainEqual(elements[1]);
    expect(tasks).not.toContainEqual(elements[2]);

  });

  it(`method getById() return null if
  task with this id does not exist`, async () => {
    const task = await storage.getById("1");
    expect(task).toBeNull();
  });

  it(`method getById() return correct value if
  task with this id exist`, async () => {
    const element: TaskOptions = {
      name: "first task",
      createdDate: 1643273967854,
      eventDate: 1643274544153,
      category: "first category",
      tags: ["first", "second", "third"],
      state: "to do",
      description: "first description",
    };
    const taskObj = new Task(element);
    const id = await storage.create(taskObj) as string;
    element.id = id;
    const task = await storage.getById(id);
    expect(task).toEqual(element);
  });

  it("method update() updates task correctly", async() => {
    const elements: TaskOptions[] = [
      {
        name: "first task",
        createdDate: 1643273967854,
        eventDate: 1643274544153,
        category: "first category",
        tags: ["first", "second", "third"],
        state: "to do",
        description: "first description",
      },
      {
        name: "second task",
        createdDate: 1643273967860,
        eventDate: 1643274544163,
        category: "second category",
        tags: ["second", "third"],
        state: "done",
        description: "second description",
      }];

      const operations: Promise<string>[] = [];
      elements.forEach((element) => {
        const taskObj = new Task(element);
        operations.push(storage.create(taskObj) as Promise<string>);
      });
      const results = await Promise.all(operations);
      results.forEach((id, idx) => { elements[idx].id = id });

      const firstTask = await storage.getById(elements[0].id as string) as Task;
      const expectedTask = {
        ...firstTask,
        name: "new task",
        category: "new category",
        state:  "done",
        description: "new description"
      }

      const done = await storage.update(expectedTask);
      const updatedFirstTask = await storage.getById(elements[0].id as string);
      const secondTask = await storage.getById(elements[1].id as string);
      expect(done).toBeTruthy();
      expect(updatedFirstTask).toEqual(expectedTask);
      expect(secondTask).toEqual(elements[1]);
  });

  it("method delete() deletes task correctly", async() => {
    const elements: TaskOptions[] = [
      {
        name: "first task",
        createdDate: 1643273967854,
        eventDate: 1643274544153,
        category: "first category",
        tags: ["first", "second", "third"],
        state: "to do",
        description: "first description",
      },
      {
        name: "second task",
        createdDate: 1643273967860,
        eventDate: 1643274544163,
        category: "second category",
        tags: ["second", "third"],
        state: "done",
        description: "second description",
      }];

      const operations: Promise<string>[] = [];
      elements.forEach((element) => {
        const taskObj = new Task(element);
        operations.push(storage.create(taskObj) as Promise<string>);
      });
      const results = await Promise.all(operations);
      results.forEach((id, idx) => { elements[idx].id = id });

      const done = await storage.delete(elements[0].id as string);
      const tasks = await storage.getAll();
      expect(done).toBeTruthy();
      expect(tasks).not.toContainEqual(elements[0]);
      expect(tasks).toContainEqual(elements[1]);
  });
});
