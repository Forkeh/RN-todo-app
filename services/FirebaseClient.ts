import { addDoc, collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase";

export type TBody = {
	[x: string]: any;
};

class FirebaseClient {
	public async Post(collectionName: string, body: TBody): Promise<string> {
		const { id } = await addDoc(collection(database, collectionName), body);
		return id;
	}

	public async Put(collectionName: string, id: string, body: TBody): Promise<void> {
		await updateDoc(doc(database, collectionName, id), body);
	}

	public async Delete(collectionName: string, id: string): Promise<void> {
		await deleteDoc(doc(database, collectionName, id));
	}
}

export default FirebaseClient;
