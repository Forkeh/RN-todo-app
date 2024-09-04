import { View, Text, TextInput, FlatList } from "react-native";
import React, { useState } from "react";

const DATA = ["Bike", "Eat"];

export default function IndexPage() {
	const [todos, setTodos] = useState<string[]>([...DATA]);
	const [input, setInput] = useState("");

	const addTodo = () => {
		setTodos([...todos, input]);
		setInput("");
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
					renderItem={({ item }) => <Text>{item}</Text>}
					keyExtractor={(t) => t}
				/>
			</View>
		</View>
	);
}
