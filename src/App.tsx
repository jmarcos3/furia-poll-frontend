import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  // Estados de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de registro manual
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  /**
   * Envia dados de login via email/senha para POST /user/loginOnPlataform
   */
  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    const payload = { email: email, password };
    try {
      const { data, status } = await axios.post(
        "http://localhost:3000/user/loginOnPlataform",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Login realizado:", status, data);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // TODO: redirecionar para área autenticada
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "❌ Erro no login. Status:",
          error.response?.status,
          "\nCorpo:",
          error.response?.data
        );
        if (error.response?.status === 401) {
          alert("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else if (error.response?.status === 404) {
          alert("Usuário não encontrado.");
        }
      } else {
        console.error(error);
      }
    }
  };

  /**
   * Envia dados para registrar novo usuário em POST /user
   */
  const handleRegister = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const payload = { name, email: registerEmail, password: registerPassword };
    try {
      const { data, status } = await axios.post(
        "http://localhost:3000/user",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Usuário cadastrado:", status, data);
      setName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "❌ Erro ao cadastrar usuário. Status:",
          error.response?.status,
          "\nCorpo:",
          error.response?.data
        );
      } else {
        console.error(error);
      }
    }
  };

  /**
   * Sucesso no login Google: POST /user/loginGoogle com Bearer token
   */
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    if (credentialResponse.credential) {
      const bearer = credentialResponse.credential;
      
      try {
        const { data, status } = await axios.post(
          "http://localhost:3000/user/loginGoogle",
          {},
          { headers: { Authorization: `Bearer ${bearer}` } }
        );
        console.log("✅ Login Google realizado:", status, data);
        if (data.token) localStorage.setItem("token", data.token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(
            "❌ Erro no login Google. Status:",
            error.response?.status,
            "\nCorpo:",
            error.response?.data
          );
        } else {
          console.error(error);
        }
      }
    }
  };

  const handleGoogleError = (): void => {
    console.error("Erro ao autenticar com Google");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-2 text-center">Login</h1>
        <p className="text-center text-gray-500 mb-6">Entre na sua conta</p>

        {/* Inputs de login */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </div>

        {/* Botão de login com Google */}
        <div className="mt-6 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {/* Seção de registro manual */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">Cadastro Manual</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="registerEmail"
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="registerPassword"
                type="password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
