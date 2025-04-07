import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged  } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { firebaseConfig } from '../fbConfig.ts';

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

export const savePreferences = async (uid, preferences) => {
  if (!uid) return
  const userDoc = doc(db, "users", uid)
  await setDoc(userDoc, { preferences }, { merge: true })
}

export const loadPreferences = async (uid) => {
  if (!uid) return null
  const userDoc = doc(db, "users", uid)
  const docSnap = await getDoc(userDoc)
  return docSnap.exists() ? docSnap.data().preferences : null
}

export const listenToAuthState = (onUser) => {
  onAuthStateChanged(auth, (user) => {
    if (user) onUser(user)
  })
}
