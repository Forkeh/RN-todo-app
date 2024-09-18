import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { database } from "../../../firebase";
import INote from "../../../models/INote";

export default function IndexPage() {
	const [values, isLoading, error] = useCollection(collection(database, "notes"));
	const notes = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as INote[];

	const [input, setInput] = useState("");
	const router = useRouter();

	const deleteTodo = (id: string) => {
		NotesEndpoints.deleteNote(id);
	};

	const addTodo = () => {
		NotesEndpoints.createNote({ name: input });
		setInput("");
	};

	const handlePress = ({ name, id }: INote) => {
		router.push({
			pathname: "/todo/[name]",
			params: { name, id }
		});
	};

	return (
		<View className="m-3">
			<View>
				<Text className="font-bold text-center">Todo List</Text>
				<TextInput
					value={input}
					onChangeText={setInput}
					onEndEditing={addTodo}
					returnKeyType="go"
					className="p-3 m-3 border border-[#f4511e] rounded-md"
					placeholder="Add a todo.."
				/>
			</View>
			<View className="m-3">
				{isLoading ? (
					<ActivityIndicator />
				) : (
					<FlatList
						contentContainerStyle={{ gap: 20 }}
						data={notes}
						renderItem={({ item }) => {
							let substring = item.name;
							if (item.name.length > 25) {
								substring = item.name.substring(0, 25) + "...";
							}

							return (
								<View className="flex-row justify-between">
									<Pressable onPress={() => handlePress(item)}>
										<Text style={{ color: "blue" }}>{substring}</Text>
									</Pressable>
									<Button title="X" onPress={() => deleteTodo(item.id)} />
								</View>
							);
						}}
						keyExtractor={(t) => t.id}
					/>
				)}
			</View>
		</View>
	);
}
