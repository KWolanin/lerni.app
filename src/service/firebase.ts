import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged  } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { firebaseConfig } from '../fbConfig.js';
import type { DocumentData } from 'firebase/firestore'
import type {User } from 'firebase/auth'

interface Preferences {
  [key: string]: unknown
}

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

export const listenToAuthState = (onUser: { (user: User): Promise<void>; (arg0: User): void; }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) void onUser(user)
  })
}
