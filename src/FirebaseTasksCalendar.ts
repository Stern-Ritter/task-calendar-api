import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { Task } from "./Task";
import TasksCalendar from "./TasksCalendar";
import { taskConverter } from "./utils/taskConverter";

export default class FirebaseTasksCalendar extends TasksCalendar {
  private app;
  private db;
  private collectionName;

  constructor(firebaseConfig: Record<string, unknown>, collectionName: string) {
    super();
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.collectionName = collectionName;
  }

  async getAll(): Promise<Task[]> {
    try {
      const ref = collection(this.db, this.collectionName).withConverter(
        taskConverter
      );
      const querySnapshot = await getDocs(ref);
      const tasks: Task[] = [];
      querySnapshot.forEach((document) => tasks.push(document.data()));
      return tasks;
    } catch (err) {
      console.log("Error get documents: ", err);
      return [];
    }
  }

  async getAllWithFilter(option: Partial<Task>): Promise<Task[]> {
    const filters = Object.entries(option)
    .map(([filter, filterValue]) => {
      if(Array.isArray(filterValue)) {
        return filterValue.map((value) => where(filter, "array-contains", value))
      }
      return where(filter, "==", filterValue)
    })
    .flat();
    const ref = query(
      collection(this.db, this.collectionName).withConverter(taskConverter),
      ...filters
    );
    const querySnapshot = await getDocs(ref);
    const tasks: Task[] = [];
    querySnapshot.forEach((document) => tasks.push(document.data()));
    return tasks;
  }

  async getById(id: string): Promise<Task | null> {
    const ref = doc(this.db, this.collectionName, String(id)).withConverter(
      taskConverter
    );
    const querySnapshot = await getDoc(ref);
    if (querySnapshot.exists()) {
      return querySnapshot.data();
    }
    return null;
  }

  async create(task: Task): Promise<string | null> {
    try {
      const ref = collection(this.db, this.collectionName).withConverter(taskConverter);
      const querySnapshot = await addDoc(ref,task);
      console.log("Document written with ID: ", querySnapshot.id);
      return querySnapshot.id;
    } catch (err) {
      console.log("Error adding document: ", err);
      return null;
    }
  }

  async update(task: Task): Promise<boolean> {
    try {
      await setDoc(doc(this.db, this.collectionName, String(task.id)), task);
      console.log("Document updated with ID: ", task.id);
      return true;
    } catch (err) {
      console.log("Error updating document: ", err);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.db, this.collectionName, String(id)));
      console.log("Document deleted with ID: ", id);
      return true;
    } catch (err) {
      console.log("Error deleting document: ", err);
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    try {
      const tasks = await this.getAll();
      const operations: Promise<void>[] = [];
      tasks.forEach((task) =>
        operations.push(deleteDoc(doc(this.db, this.collectionName, String(task.id)))));
      await Promise.all(operations);
      console.log("All documens deleted");
      return true;
    } catch (err) {
      console.log("Error deleting all documents: ", err);
      return false;
    }
  }
}
