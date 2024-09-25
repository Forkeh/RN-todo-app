import { View, TextInput, Button, Image, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";

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
		});

		if (result.canceled) {
			return;
		}

		setImagePath(result.assets[0].uri);
	};

	const handleImageUpload = async () => {
		const res = await fetch(imagePath);
		const blob = await res.blob();
		const storageRef = ref(storage, `image_${id}`)
		
		await uploadBytes(storageRef, blob)

		alert("Image uploaded!")
	}


	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				{imagePath && (
					<>
						<Image className="w-72 h-72" source={{ uri: imagePath }} />
						<Pressable onPress={handleImageUpload}>Upload image</Pressable>
					</>
				)}
				<Pressable onPress={handlePickImage}>Pick image</Pressable>
			</View>
		</View>
	);
}
