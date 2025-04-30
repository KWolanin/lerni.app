import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged  } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { firebaseConfig } from '../fbConfig.js';
import type { DocumentData } from 'firebase/firestore'
import type {User } from 'firebase/auth'
import type { KanbanColumn, KanbanTask, Preferences, TodoTask, Widget } from "src/types.js";

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const provider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Błąd logowania:", error)
  }
}

export const logout = async () => {
  await signOut(auth)
}

export const savePreferences = async (uid:string, preferences: Preferences) => {
  if (!uid) return
  const userDoc = doc(db, "users", uid)
  await setDoc(userDoc, { preferences }, { merge: true })
}

export const loadPreferences = async (uid:string) : Promise<DocumentData | null>  => {
  if (!uid) return null
  const userDoc = doc(db, "users", uid)
  const docSnap = await getDoc(userDoc)
  return docSnap.exists() ? docSnap.data().preferences : null
}

export const loadStarters = async (uid:string) : Promise<DocumentData | null> => {
  const starters = doc(db, 'users', uid, 'defaults', 'starters')
  const docSnap = await getDoc(starters)
  return docSnap.exists() ? docSnap.data() : null
}

export const saveStarters = async (uid: string, starters: Record<string, boolean>) => {
  if (!uid) return
  const startersDoc = doc(db, 'users', uid, 'defaults', 'starters')
  await setDoc(startersDoc, starters, { merge: true })
}

export const loadTodo = async (uid: string): Promise<TodoTask[] | null> => {
  if (!uid) return null
  const todoDoc = doc(db, 'users', uid, 'todos', 'todos')
  const docSnap = await getDoc(todoDoc)
  if (docSnap.exists()) {
    const data = docSnap.data()
    return data?.list ?? []
  }
  return null
}

export const saveTodo = async (uid: string, todo: TodoTask[]) => {
  if (!uid) return
  const todoDoc = doc(db, 'users', uid, 'todos', 'todos')
  await setDoc(todoDoc, { list: todo }, { merge: true })
}


export const loadTheme = async (uid:string) : Promise<DocumentData | null> => {
  const theme = doc(db, 'users', uid, 'defaults', 'theme')
  const docSnap = await getDoc(theme)
  return docSnap.exists() ? docSnap.data() : null
}

export const saveTheme = async (uid: string, theme: string) => {
  if (!uid) return
  const themeDoc = doc(db, 'users', uid, 'defaults', 'theme')
  await setDoc(themeDoc, {theme: theme}, { merge: true })
}

export const loadLanguage = async (uid:string) : Promise<DocumentData | null> => {
  const language = doc(db, 'users', uid, 'defaults', 'language')
  const docSnap = await getDoc(language)
  return docSnap.exists() ? docSnap.data() : null
}

export const saveLanguage = async (uid: string, language: string) => {
  if (!uid) return
  const langDoc = doc(db, 'users', uid, 'defaults', 'language')
  await setDoc(langDoc, {language: language}, { merge: true })
}

export const loadNote = async (uid: string) :Promise<string | null> => {
  const note = doc(db, 'users', uid)
  const docSnap = await getDoc(note)
  return docSnap.exists() ? docSnap.data().note : null
}

export const saveNote = async (uid: string, note: string) => {
  if (!uid) return
  const themeDoc = doc(db, 'users', uid)
  await setDoc(themeDoc, {note: note}, { merge: true })
}

export const loadLayout = async (uid: string) : Promise<Widget[] | null>  => {
  const layout = doc(db, 'users', uid, 'layouts', 'layout')
  const docSnap = await getDoc(layout)
  return docSnap.exists() ? docSnap.data().layout : null
}

export const saveLayout = async (uid: string, layout: Widget[]) => {
  if (!uid) return
  const layoutDoc = doc(db, 'users', uid, 'layouts', 'layout')
  await setDoc(layoutDoc, {layout: layout}, { merge: true })
}

export const loadSelectedWidgets = async (uid: string): Promise<string[] | null> => {
  const selectedRef = doc(db, 'users', uid, 'layouts', 'selected')
  const docSnap = await getDoc(selectedRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    return data.widgets ?? []
  }

  return null
}


export const saveSelectedWidgets = async (uid: string, widgets: string[]) => {
  if (!uid) return
  const widgetsDoc = doc(db, 'users', uid, 'layouts', 'selected')
  await setDoc(widgetsDoc, {widgets: widgets}, { merge: true })
}

export const listenToAuthState = (onUser: { (user: User): Promise<void>; (arg0: User): void; }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) void onUser(user)
  })
}
export const saveKanbanTasks = async (uid: string, columns: KanbanColumn[]) => {
  if (!uid) return;

  const tasksData = columns.reduce((acc: Record<string, KanbanTask[]>, column) => {
    acc[column.id] = column.tasks;
    return acc;
  }, {} as Record<string, KanbanTask[]>);

  const kanbanDocRef = doc(db, 'users', uid, 'kanban', 'tasks');
  await setDoc(kanbanDocRef, tasksData, { merge: true });
};

export const loadKanban = async (uid: string): Promise<Record<string, KanbanTask[]> | null> => {
  if (!uid) return null;

  const kanbanDocRef = doc(db, 'users', uid, 'kanban', 'tasks');
  const docSnap = await getDoc(kanbanDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as Record<string, KanbanTask[]>;
  }

  return null;
};
