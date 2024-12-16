import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AuthScreen from "../screens/AuthScreen";

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

describe('AuthScreen', () => {
    const mockAuthContext = {
        signUp: jest.fn(),
        signIn: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly in login mode', () => {
        render(<AuthScreen />);
        expect(screen.getByText('Entrar')).toBeInTheDocument();
        expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
        expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    test('renders correctly in signup mode', () => {
        render(<AuthScreen setIsLogin={() => true} />);
        expect(screen.getByText('Criar Conta')).toBeInTheDocument();
        expect(screen.getByLabelText('Nome de Usuário')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    });

    test('validates username', () => {
        render(<AuthScreen />);

        fireEvent.changeText(screen.getByLabelText('Nome de Usuário'), 'invalid_username');

        expect(screen.getByText('Username inválido')).toBeInTheDocument();
    });

    test('validates email', () => {
        render(<AuthScreen />);

        fireEvent.changeText(screen.getByLabelText('E-mail'), 'invalid.email');

        expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    test('validates password', () => {
        render(<AuthScreen />);

        fireEvent.changeText(screen.getByLabelText('Senha'), 'short');

        expect(screen.getByText('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número')).toBeInTheDocument();
    });

    test('validates password match', () => {
        render(<AuthScreen />);

        fireEvent.changeText(screen.getByLabelText('Senha'), 'password123');
        fireEvent.changeText(screen.getByLabelText('Confirmar Senha'), 'different_password');

        expect(screen.getByText('As senhas devem ser iguais')).toBeInTheDocument();
    });

    test('handles authentication', async () => {
        const { getByText } = render(<AuthScreen />);

        fireEvent.press(getByText('Entrar'));

        await screen.findByText('Login bem-sucedido');
    });
});
