import LocalStorageTasksCalendar from "./LocalStorageTasksCalendar";
import { Task, TaskOptions } from "./Task";
import { storageKey } from "./utils/config";

let storage: LocalStorageTasksCalendar;

describe("LocalStorageTasksCalendar", () => {
  beforeEach(async() => {
    storage = new LocalStorageTasksCalendar(storageKey);
    await storage.deleteAll();
  });

  it(`method getAll() return empty array if
  method create() has never been called yet`, async () => {
    const tasks = await storage.getAll();
    expect(tasks).toEqual([]);
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

    for(const element of elements) {
      const taskObj = new Task({ ...element });
      const id = await storage.create(taskObj);
      expect(id).not.toBeNull();
    }

    const tasks = await storage.getAll();
    const expectedTasks = elements.map((element, idx) => ({...element, id: String(idx + 1)}));
    expect(tasks).toEqual(expectedTasks);
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

    for(const element of elements) {
      const taskObj = new Task({ ...element });
      const id = await storage.create(taskObj);
      expect(id).not.toBeNull();
    }

    let tasks = await storage.getAllWithFilter({tags: ["second"]});
    expect(tasks).toHaveLength(2);
    expect(tasks).toContainEqual({...elements[0], id: "1"});
    expect(tasks).toContainEqual({...elements[1], id: "2"});
    expect(tasks).not.toContainEqual({...elements[2], id: "3"});

    tasks = await storage.getAllWithFilter({description: "second description"});
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual({...elements[1], id: "2"});

    tasks = await storage.getAllWithFilter({createdDate: 1643273967854});
    expect(tasks).toHaveLength(2);
    expect(tasks).toContainEqual({...elements[0], id: "1"});
    expect(tasks).not.toContainEqual({...elements[1], id: "2"});
    expect(tasks).toContainEqual({...elements[2], id: "3"});

    tasks = await storage.getAllWithFilter({state: "done"});
    expect(tasks).toHaveLength(2);
    expect(tasks).not.toContainEqual({...elements[0], id: "1"});
    expect(tasks).toContainEqual({...elements[1], id: "2"});
    expect(tasks).toContainEqual({...elements[2], id: "3"});
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
    const taskObj = new Task({ ...element });
    const id = await storage.create(taskObj);
    const task = await storage.getById("1");
    expect(id).not.toBeNull();
    expect(task).toEqual({ ...element, id: "1" });
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

      for(const element of elements) {
        const taskObj = new Task({ ...element });
        await storage.create(taskObj);
      }

      const firstTask = await storage.getById("1") as Task;
      const expectedTask = {
        ...firstTask,
        name: "new task",
        category: "new category",
        state:  "done",
        description: "new description"
      }

      const done = await storage.update(expectedTask);
      const updatedFirstTask = await storage.getById("1");
      const secondTask = await storage.getById("2");
      expect(done).toBeTruthy();
      expect(updatedFirstTask).toEqual(expectedTask);
      expect(secondTask).toEqual({...elements[1], id: "2"});
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

      for(const element of elements) {
        const taskObj = new Task({ ...element });
        await storage.create(taskObj);
      }

      const done = await storage.delete("1");
      const tasks = await storage.getAll();
      expect(done).toBeTruthy();
      expect(tasks).not.toContainEqual({...elements[0], id: "1"});
      expect(tasks).toContainEqual({...elements[1], id: "2"});
  });
});
