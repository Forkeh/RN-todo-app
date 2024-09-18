// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
import { Firestore, getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyCyw2gWQI0oDyraDfe4n_eRkMBMdffkgrc",

	authDomain: "rn-todo-app-6832a.firebaseapp.com",

	projectId: "rn-todo-app-6832a",

	storageBucket: "rn-todo-app-6832a.appspot.com",

	messagingSenderId: "77468949049",

	appId: "1:77468949049:web:c4e637c2c7b4ffe13a0be8"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app, database };
