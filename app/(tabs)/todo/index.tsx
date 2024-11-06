import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { database } from "../../../firebase";
import INote from "../../../models/INote";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";

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

	function swipeOff(todoId: string) {
		deleteTodo(todoId);
	}

	return (
		<GestureHandlerRootView className="flex-1">
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
								return (
									<MyTodo
										key={item.id}
										item={item}
										deleteTodo={deleteTodo}
										handlePress={handlePress}
										onSwipeOff={swipeOff}
									/>
								);
							}}
							keyExtractor={(t) => t.id}
						/>
					)}
				</View>
			</View>
		</GestureHandlerRootView>
	);
}

interface MyTodoProps {
	item: INote;
	handlePress: ({ name, id }: INote) => void;
	deleteTodo: (id: string) => void;
	onSwipeOff: (todoId: string) => void;
}

const MyTodo = ({ item, handlePress, deleteTodo, onSwipeOff }: MyTodoProps) => {
	const translateX = useSharedValue(0);
	const rotate = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			"worklet";
			translateX.value = event.translationX;
			// rotate.value = -translateX.value / 25;
		})
		.onEnd(() => {
			"worklet";
			if (Math.abs(translateX.value) > 150) {
				translateX.value = withSpring(500); // Rykker ud af vinduet
				runOnJS(onSwipeOff)(item.id);
			} else {
				translateX.value = withSpring(0);
				// rotate.value = withSpring(0);
			}
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }, { rotate: rotate.value + "deg" }]
		};
	});

	let substring = item.name;
	if (item.name.length > 25) {
		substring = item.name.substring(0, 25) + "...";
	}

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={animatedStyle} className="flex-row justify-between items-center bg-slate-200 p-1 rounded-sm">
				<Pressable onPress={() => handlePress(item)}>
					<Text style={{ color: "blue" }}>{substring}</Text>
				</Pressable>
				<Button title="X" onPress={() => deleteTodo(item.id)} />
			</Animated.View>
		</GestureDetector>
	);
};
