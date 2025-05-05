import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data,status } = await axios.post(
        "http://localhost:3000/user/loginOnPlataform",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (status === 201){
        localStorage.setItem("token", data.token);
        console.log("✅ Login realizado:", data);
        navigate("/polls");
      }

    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const { data,status } = await axios.post(
        "http://localhost:3000/user/loginGoogle",
        {},
        { headers: { Authorization: `Bearer ${credentialResponse.credential}` } }
      );
      if (status === 201){
        localStorage.setItem("token",`${credentialResponse.credential}` );
        console.log("✅ Google login:", data);
        navigate("/polls");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700"
          >
            Entrar
          </button>
          <div className="flex justify-center space-x-4 mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Erro ao logar com Google")}
              useOneTap
              shape="pill"
              width="100%"
              text="signin_with"
              theme="outline"
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Ainda não tem uma conta?</span>{" "}
            <Link
              to="/Register"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Registre-se aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
