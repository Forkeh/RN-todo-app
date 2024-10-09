import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: "#f4511e"
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold"
                }
			}}
		>
			<Tabs.Screen name="(home)" options={{headerShown: false, title: "Home", tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />}} />
			<Tabs.Screen name="todo" options={{headerShown: false, title: "Todo", tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />}} />
			<Tabs.Screen name="map" options={{headerShown: false, title: "Map", tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />}} />
           
		</Tabs>
	);
}
