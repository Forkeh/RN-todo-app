import { View, TextInput, Button, Image, Pressable, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function TodoPage() {
	const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
	const [input, setInput] = React.useState(name);
	const [imagePath, setImagePath] = React.useState("");
	const router = useRouter();

	React.useEffect(() => {
		const storageRef = ref(storage, `image_${id}`);
		getDownloadURL(storageRef)
			.then((url) => setImagePath(url))
			.catch((error) => console.log("Couldn't find the image:", error));
	}, [id]);

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

		const res = await fetch(imagePath);
		const blob = await res.blob();
		const storageRef = ref(storage, `image_${id}`);

		await uploadBytes(storageRef, blob);
		setImagePath(result.assets[0].uri);
	};

	const handleRemoveImage = async () => {
		const storageRef = ref(storage, `image_${id}`);

		try {
			await deleteObject(storageRef);
			setImagePath("");
		} catch (error) {
			alert("Could not delete image: " +  error);
		}
	};

	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				{imagePath && (
					<>
						<Image className="w-72 h-72" source={{ uri: imagePath }} />
						<Pressable onPress={handleRemoveImage}>
							<Text className="text-color-red">Remove image</Text>
						</Pressable>
					</>
				)}
				<Pressable onPress={handlePickImage}>
					<Text>Pick image</Text>
				</Pressable>

				<Pressable onPress={handleUpdate}>
					<Text>Finish</Text>
				</Pressable>
			</View>
		</View>
	);
}
