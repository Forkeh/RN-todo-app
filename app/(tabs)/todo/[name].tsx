import { View, TextInput, Button } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";

export default function TodoPage() {
	const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
	const [input, setInput] = React.useState(name);
	const router = useRouter();

	const handleUpdate = () => {
		NotesEndpoints.updateNote(id, { name: input });
		router.back();
	};

	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				<Button title="Update" onPress={handleUpdate} />
			</View>
		</View>
	);
}
