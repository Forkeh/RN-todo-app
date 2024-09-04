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
			<Tabs.Screen name="index" options={{title: "Home", tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,}} />
            <Tabs.Screen name="todo" options={{ title: "My List", tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />, }} />
		</Tabs>
	);
}
