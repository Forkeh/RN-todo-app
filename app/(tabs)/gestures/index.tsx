import { View, Text } from "react-native";
import React from "react";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function GesturesPage() {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			"worklet";
			translateX.value = event.translationX;
			translateY.value = event.translationY;
		})
		.onEnd(() => {
			"worklet";
			translateX.value = withSpring(0);
			translateY.value = withSpring(0);
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }, { translateY: translateY.value }]
		};
	});

	return (
		<GestureHandlerRootView className="flex-1">
			<GestureDetector gesture={panGesture}>
				<Animated.View style={animatedStyle} className="flex-1 justify-center items-center">
					<Text>Drag Me! 👆</Text>
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
