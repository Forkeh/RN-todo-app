import { View, ActivityIndicator, Text, Image } from "react-native";
import React from "react";
import MapView, { Callout, LongPressEvent, Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { database, storage } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Svg, Image as ImageSvg } from "react-native-svg";

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
		const fetchImageUrls = async () => {
			try {
				const storageRef = ref(storage, `map_images/`);
				const result = await listAll(storageRef);
				const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
				const urls = await Promise.all(urlPromises);
				setImagePath(urls);
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		};

		fetchImageUrls();
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
								<View className="h-28 w-28">
									<Svg width={"100%"} height={"100%"}>
										<ImageSvg
											width={"100%"}
											height={"100%"}
											preserveAspectRatio="xMidYMid slice"
											href={{ uri: imagePath.find((i) => i.includes(String(marker.key))) }}
										/>
									</Svg>
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
