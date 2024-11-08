import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import ProfileScreen from "../screens/ProfileScreen";

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}));

const mockLogOut = jest.fn();
const mockNavigation = { navigate: jest.fn() };

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should display 'Carregando...' when user is not logged in", () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: null, logOut: mockLogOut }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        expect(getByText("Carregando...")).toBeTruthy();
    });

    it("should display username and logout button when user is logged in", () => {
        const user = { username: "testuser" };
        const { getByText } = render(
            <AuthContext.Provider value={{ user, logOut: mockLogOut }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        expect(getByText("Username: testuser")).toBeTruthy();

        expect(getByText("Logout")).toBeTruthy();
    });

    it("should navigate to 'Auth' screen when user is not logged in", async () => {
        useNavigation.mockReturnValue(mockNavigation);

        render(
            <AuthContext.Provider value={{ user: null, logOut: mockLogOut }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth"));
    });

    it("should call logOut function and navigate to 'Auth' when logout button is pressed", async () => {
        const user = { username: "testuser" };
        useNavigation.mockReturnValue(mockNavigation);

        const { getByText } = render(
            <AuthContext.Provider value={{ user, logOut: mockLogOut }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText("Logout"));

        await waitFor(() => expect(mockLogOut).toHaveBeenCalledTimes(1));

        await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalledWith("Auth"));
    });
});
