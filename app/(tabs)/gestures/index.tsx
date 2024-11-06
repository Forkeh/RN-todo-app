import { View, Text, Image, ImageSourcePropType } from "react-native";
import React, { useState } from "react";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";

export default function GesturesPage() {
	const [images, setImages] = useState([
		{ id: 1, imgUrl: require("../../../assets/cat_dog.jpg") },
		{ id: 2, imgUrl: require("../../..//assets/hedgehog.jpg") },
		{ id: 3, imgUrl: require("../../..//assets/quokka.jpg") }
	]);

	function swipeOff(cardId: number) {
		setImages((prevImages) => prevImages.filter((image) => image.id !== cardId));
	}

	return (
		<GestureHandlerRootView className="flex-1">
			{images.map((image) => (
				<MyCard key={image.id} image={image} onSwipeOff={swipeOff} />
			))}
		</GestureHandlerRootView>
	);
}

interface MyCardProps {
	image: {
		id: number;
		imgUrl: ImageSourcePropType;
	};
	onSwipeOff: (cardId: number) => void;
}

const MyCard = ({ image, onSwipeOff }: MyCardProps) => {
	const translateX = useSharedValue(0);
	const rotate = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			"worklet";
			translateX.value = event.translationX;
			rotate.value = -translateX.value / 25;
		})
		.onEnd(() => {
			"worklet";
			if (Math.abs(translateX.value) > 150) {
				console.log("DELETE");
				translateX.value = withSpring(500); // Rykker ud af vinduet
				runOnJS(onSwipeOff)(image.id);
			} else {
				translateX.value = withSpring(0);
				rotate.value = withSpring(0);
			}
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }, { rotate: rotate.value + "deg" }]
		};
	});

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={animatedStyle} className="flex-1 justify-center items-center">
				<Image source={image.imgUrl} className="w-48 h-48" />
			</Animated.View>
		</GestureDetector>
	);
};
