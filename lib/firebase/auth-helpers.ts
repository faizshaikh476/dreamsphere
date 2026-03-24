import {
  User,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase/client";

async function upsertUser(user: User, fallbackName?: string) {
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    await setDoc(ref, {
      id: user.uid,
      name: fallbackName || user.displayName || "Dreamer",
      email: user.email || null,
      avatar_seed: user.uid.slice(0, 12),
      streak_count: 0,
      created_at: serverTimestamp()
    });
  }
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await upsertUser(result.user);
}

export async function signInGuest() {
  const result = await signInAnonymously(auth);
  await upsertUser(result.user);
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await upsertUser(result.user, name);
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await upsertUser(result.user);
}
