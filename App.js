import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Importando AuthProvider
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import MovieScreen from "./screens/MovieScreen";
import MoviesScreen from "./screens/MoviesScreen";
import ProfileScreen from "./screens/ProfileScreen";

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Entypo name="home" size={24} color="black" />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Movies"
                        component={MoviesScreen}
                        options={{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome name="search" size={24} color="black" />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="user-alt" size={24} color="black" />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Movie"
                        component={MovieScreen}
                        options={{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarButton: () => null,
                        }}
                    />
                    <Tab.Screen
                        name="Auth"
                        component={AuthScreen}
                        options={{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarButton: () => null,
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
