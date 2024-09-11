import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const DATA = ["Study React Native and learning Expo Router blah blah blah", "Eat"];

export default function IndexPage() {
	const [todos, setTodos] = useState<string[]>([...DATA]);
	const [input, setInput] = useState("");
	const router = useRouter();

	const addTodo = () => {
		setTodos([...todos, input]);
		setInput("");
	};

	const handlePress = (name: string) => {
		router.push("/todo/" + name);
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
				<FlatList
					contentContainerStyle={{ gap: 20 }}
					data={todos}
					renderItem={({ item }) => {
						let substring = item;
						if (item.length > 25) {
							substring = item.substring(0, 25) + "...";
						}

						return (
							<Pressable onPress={() => handlePress(item)}>
								<Text style={{ color: "blue" }}>{substring}</Text>
							</Pressable>
						);
					}}
					keyExtractor={(t) => t}
				/>
			</View>
		</View>
	);
}
