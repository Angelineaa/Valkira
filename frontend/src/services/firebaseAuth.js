import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return idToken;
}
