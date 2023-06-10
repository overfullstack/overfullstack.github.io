import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY || `not_found_in_env`,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN || `not_found_in_env`,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID || `not_found_in_env`,
}

const app = initializeApp(firebaseConfig)

export default app
