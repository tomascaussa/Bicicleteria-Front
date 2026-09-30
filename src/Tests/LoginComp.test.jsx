import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import LoginComp from '../components/LoginComp'; // Ajustá la ruta si es necesario
import * as AuthContext from '../Context/AuthContext';
import * as RouterDom from 'react-router-dom';


// 1. Mockeamos la navegación (flujo externo)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 2. Mockeamos el contexto de autenticación (flujo externo)
vi.mock('../Context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Test Unitarios - LoginComp', () => {

  // TEST UNITARIO 1: Validaciones locales del formulario
  it('Debe mostrar errores de validación si se envía el formulario vacío', () => {
    // Configuramos el mock para que devuelva una función login vacía
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ login: vi.fn() });
    
    render(<LoginComp />);

    // Buscamos el botón y hacemos click sin llenar los inputs
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(botonIngresar);

    // Verificamos que los mensajes de error aparezcan en el DOM
    expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  // TEST UNITARIO 2: Flujo exitoso y llamada a flujos externos
  it('Debe llamar a la función login y redirigir al home al ingresar datos válidos', async () => {
    // Configuramos el mock simulando que el login al backend fue exitoso
    const mockLogin = vi.fn().mockResolvedValue(); 
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ login: mockLogin });

    render(<LoginComp />);

    // Llenamos los inputs con datos válidos
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    fireEvent.change(emailInput, { target: { value: 'usuario@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    // Hacemos click en el botón
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(botonIngresar);

    // Verificamos de forma asíncrona que las funciones externas se hayan llamado correctamente
    await waitFor(() => {
      // Verifica que el login del context recibió los parámetros correctos
      expect(mockLogin).toHaveBeenCalledWith('usuario@test.com', '123456');
      // Verifica que se ejecutó la redirección a "/"
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

});