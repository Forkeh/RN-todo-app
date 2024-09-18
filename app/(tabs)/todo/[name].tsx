import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

export default function TodoPage() {
	const { name } = useLocalSearchParams<{ name: string }>();

	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<Text>{name}</Text>
			</View>
			
		</View>
	);
}
