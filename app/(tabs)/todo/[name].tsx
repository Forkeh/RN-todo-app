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

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsMultipleSelection: true
		});

		if (result.canceled) {
			return;
		}

		const URIs = result.assets.map((r: any) => r.uri);

		for (let i = 0; i < URIs.length; i++) {
			const imageUri = URIs[i];
			const res = await fetch(imageUri);
			const blob = await res.blob();
			const imageRef = ref(storage, `todo_images/${id}/image_${Date.now()}_${i}.jpg`);

			await uploadBytes(imageRef, blob);
		}

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

	return (
		<View className="flex-1">
			<View className="justify-center items-center p-5">
				<Stack.Screen options={{ headerTitle: name }} />
				<TextInput value={input} onChangeText={setInput} className="border p-2 m-2" />
				{imagePath && (
					<ScrollView >
						{/* <FlatList
							data={imagePath}
							renderItem={({ item }) => (
								<View style={{marginTop: 20}}>
									<Image className="w-24 h-24" source={{ uri: item }} />
									<Pressable onPress={() => handleRemoveImage(item)}>
										<Text className="text-color-red">Remove image</Text>
									</Pressable>
								</View>
							)}
							
						/> */}
						{imagePath.map((image) => (
							<View className="mr-5 mb-10" key={image}>
								<Image className="w-52 h-52" source={{ uri: image }} />
								<Pressable onPress={() => handleRemoveImage(image)}>
									<Text className="text-color-red">Remove image</Text>
								</Pressable>
							</View>
						))}
					</ScrollView>
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
