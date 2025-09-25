import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import firebaseConfig from "../../firebase.config.json"

export const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
