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
} from "firebase/firestore";
import Task from "./Task";
import TasksCalendar from "./TasksCalendar";
import { taskConverter } from "./utils/taskConverter";

class FirebaseTasksCalendar extends TasksCalendar {
  private app;
  private db;
  private collectionName;

  constructor(firebaseConfig: Object, collectionName: string) {
    super();
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore();
    this.collectionName = "tasks";
  }

  async getAll(): Promise<Task[]> {
    const ref = collection(this.db, this.collectionName).withConverter(taskConverter);
    const querySnapshot = await getDocs(ref);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => tasks.push(doc.data()));
    return tasks;
  }

  async getById(id: number): Promise<Task | null> {
    const ref = doc(this.db, this.collectionName, String(id)).withConverter(taskConverter);
    const docSnap = await getDoc(ref);
    if(docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
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
