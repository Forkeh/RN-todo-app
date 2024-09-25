import { View, TextInput, Button, Image } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import * as ImagePicker from "expo-image-picker";


export default function TodoPage() {
	const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
	const [input, setInput] = React.useState(name);
	const [imagePath, setImagePath] = React.useState("");
	const router = useRouter();

	const handleUpdate = () => {
		NotesEndpoints.updateNote(id, { name: input });
		router.back();
	};

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true
		})

		if (result.canceled) {
			return;
		}
		
		setImagePath(result.assets[0].uri)
	}

	console.log(imagePath);
	

	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				<Button title="Update" onPress={handleUpdate} />
				{imagePath && <Image style={{height: 300, width: 300}} source={{uri: imagePath}}/>}
				<Button title="Pick image" onPress={handlePickImage} />
			</View>
		</View>
	);
}
