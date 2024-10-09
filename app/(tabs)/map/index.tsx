import { View, ActivityIndicator, Text, Image } from "react-native";
import React from "react";
import MapView, { Callout, LongPressEvent, Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { database, storage } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

interface IMarker {
	coordinate: { latitude: number; longitude: number };
	key: number;
	title?: string;
}

const MapPage = () => {
	const [imagePath, setImagePath] = React.useState<string[]>([]);
	const [values, isLoading, error] = useCollection(collection(database, "markers"));
	const markers = values?.docs.map((doc) => ({ ...doc.data() })) as IMarker[];

	React.useEffect(() => {
		const storageRef = ref(storage, `map_images/`);
		listAll(storageRef)
			.then((result) => {
				// Fetch URLs for all images
				const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
				Promise.all(urlPromises).then((urls) => setImagePath(urls));
			})
			.catch(() => console.log("No Images found"));
	}, []);

	const uploadMarker = async (newMarker: IMarker) => {
		const { id } = await addDoc(collection(database, "markers"), newMarker);
		return id;
	};

	const uploadImages = async (URIs: string[], id: number) => {
		for (let i = 0; i < URIs.length; i++) {
			const imageUri = URIs[i];
			const res = await fetch(imageUri);
			const blob = await res.blob();
			const imageRef = ref(storage, `map_images/image_${id}`);

			await uploadBytes(imageRef, blob);
		}
	};

	const handleAddMarker = async (e: LongPressEvent) => {
		e.persist();
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true
		});

		if (result.canceled) {
			return;
		}

		const URI = result.assets[0].uri;

		setImagePath((prev) => [...prev, URI]);

		const { latitude, longitude } = e.nativeEvent.coordinate;

		const newMarker: IMarker = {
			coordinate: { latitude, longitude },
			key: e.timeStamp
		};

		await uploadMarker(newMarker);
		await uploadImages([URI], newMarker.key);
	};

	return (
		<View className="flex-1">
			{isLoading ? (
				<ActivityIndicator />
			) : (
				<MapView onLongPress={handleAddMarker} showsUserLocation loadingEnabled className="w-full h-full">
					{markers.map((marker) => (
						<Marker coordinate={marker.coordinate} key={marker?.key} title={marker?.title}>
							<Callout>
								<View className="p-5">
                                    <Text>Test</Text>
									<Text>
										<Image
											style={{ height: 100, width: 100 }}
											source={{ uri: imagePath.find((i) => i.includes(String(marker.key))) }}
										/>
									</Text>
								</View>
							</Callout>
						</Marker>
					))}
				</MapView>
			)}
		</View>
	);
};

export default MapPage;
