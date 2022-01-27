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
    this.db = getFirestore();
    this.collectionName = collectionName;
  }

  async getAll(): Promise<Task[]> {
    const ref = collection(this.db, this.collectionName).withConverter(
      taskConverter
    );
    const querySnapshot = await getDocs(ref);
    const tasks: Task[] = [];
    querySnapshot.forEach((document) => tasks.push(document.data()));
    return tasks;
  }

  async getAllWithFilter(option: Partial<Task>): Promise<Task[]> {
    const filters = Object.entries(option).map(([property, value]) => where(property, "==", value));
    const request = query(
      collection(this.db, this.collectionName).withConverter(taskConverter),
      ...filters
    );
    const querySnapshot = await getDocs(request);
    const tasks: Task[] = [];
    querySnapshot.forEach((document) => tasks.push(document.data()));
    return tasks;
  }

  async getById(id: number): Promise<Task | null> {
    const ref = doc(this.db, this.collectionName, String(id)).withConverter(
      taskConverter
    );
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  async create(task: Task): Promise<boolean> {
    try {
      const docRef = await addDoc(
        collection(this.db, this.collectionName),
        task
      );
      console.log("Document written with ID: ", docRef.id);
      return true;
    } catch (err) {
      console.log("Error adding document: ", err);
      return false;
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

  async delete(id: number): Promise<boolean> {
    try {
      await deleteDoc(doc(this.db, this.collectionName, String(id)));
      console.log("Document deleted with ID: ", id);
      return true;
    } catch (err) {
      console.log("Error deleting document: ", err);
      return false;
    }
  }
}
