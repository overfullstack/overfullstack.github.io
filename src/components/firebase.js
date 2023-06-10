import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY || `none`,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN || `none`,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID || `none`,
}

const app = initializeApp(firebaseConfig)

export default app
