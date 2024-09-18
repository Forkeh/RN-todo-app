import FirebaseClient, { TBody } from "./FirebaseClient";

class NotesEndpoints {
	public static async createNote(body: TBody): Promise<string> {
		const client = new FirebaseClient();
		const id = await client.Post("notes", body);

		return id;
	}

	public static async updateNote(id: string, body: TBody): Promise<void> {
		const client = new FirebaseClient();
		await client.Put("notes", id, body);
	}

	public static async deleteNote(id: string): Promise<void> {
		const client = new FirebaseClient();
		await client.Delete("notes", id);
	}
}

export default NotesEndpoints;
