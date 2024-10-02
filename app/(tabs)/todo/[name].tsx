import { View, TextInput, Image, Pressable, Text, ScrollView, FlatList } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import NotesEndpoints from "../../../services/NotesEndpoints";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";

export default function TodoPage() {
	const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
	const [input, setInput] = React.useState(name);
	const [imagePath, setImagePath] = React.useState<string[]>([]);
	const router = useRouter();

	React.useEffect(() => {
		const storageRef = ref(storage, `todo_images/${id}/`);
		listAll(storageRef)
			.then((result) => {
				// Fetch URLs for all images
				const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
				Promise.all(urlPromises).then((urls) => setImagePath(urls));
			})
			.catch(() => console.log("No Images found"));
	}, [id]);

	const handleUpdate = () => {
		NotesEndpoints.updateNote(id, { name: input });
		router.back();
	};

	const uploadImages = async (URIs: string[]) => {
		for (let i = 0; i < URIs.length; i++) {
			const imageUri = URIs[i];
			const res = await fetch(imageUri);
			const blob = await res.blob();
			const imageRef = ref(storage, `todo_images/${id}/image_${Date.now()}_${i}.jpg`);

			await uploadBytes(imageRef, blob);
		}
	};

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true
		});

		if (result.canceled) {
			return;
		}

		const URIs = result.assets.map((r: any) => r.uri);

		await uploadImages(URIs);

		setImagePath((prev) => [...prev, ...URIs]);
	};

	const handleRemoveImage = async (deleteURI: string) => {
		const imageRef = ref(storage, deleteURI);
		try {
			await deleteObject(imageRef);
			setImagePath((prev) => prev.filter((url) => url !== deleteURI));
		} catch (error) {
			console.log("Could not delete image", error);
		}
	};

	const launchCamera = async () => {
		// Permission
		const permission = await ImagePicker.requestCameraPermissionsAsync(); // Ask for permission

		if (!permission.granted) {
			alert("Camera access not provided");
			return;
		}

		// Launch camera
		ImagePicker.launchCameraAsync({
			quality: 1,
			allowsEditing: true
		})
			.then((response) => {
				if (response.canceled) {
					throw new Error();
				}

				setImagePath((prev) => [...prev, response.assets[0].uri]);
				return response.assets.map((r: any) => r.uri);
			})
			.then((URI) => uploadImages(URI))
			.catch((error) => {
				alert("Fejl med kameraet: " + error);
			});
	};

	return (
		<View className="flex-1">
			<View className="flex-1 justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				{imagePath && (
					<FlatList
						className="h-3/4"
						keyExtractor={(item) => item}
						data={imagePath}
						renderItem={({ item }) => (
							<View className="mt-2">
								<Image className="w-36 h-36" source={{ uri: item }} />
								<Pressable className="m-1 rounded-md shadow-md" onPress={() => handleRemoveImage(item)}>
									<Text className="text-color-red text-center bg-red-300">Remove image</Text>
								</Pressable>
							</View>
						)}
					/>
				)}
				<Pressable className="bg-blue-400 m-2 p-2 rounded-md shadow-md" onPress={handlePickImage}>
					<Text>Pick image</Text>
				</Pressable>
				<Pressable className="bg-blue-400 m-2 p-2 rounded-md shadow-md" onPress={launchCamera}>
					<Text>Take picture</Text>
				</Pressable>

				<Pressable className="bg-green-400 p-2 rounded-md shadow-md" onPress={handleUpdate}>
					<Text>Finish</Text>
				</Pressable>
			</View>
		</View>
	);
}
