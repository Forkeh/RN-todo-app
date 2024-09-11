import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

export default function TodoPage() {
	const { name } = useLocalSearchParams<{ name: string }>();

	return (
		<View className="flex-1">
			<View className="justify-center items-center bg-red-400 basis-1/3">
				<Stack.Screen options={{ headerTitle: name }} />
				<Text>{name}</Text>
			</View>
			<View className="basis-2/3 bg-blue-300">
				<Text>Hej</Text>
			</View>
		</View>
	);
}
