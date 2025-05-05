import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { status } = await axios.post(
        "http://localhost:3000/user",
        { name, email: registerEmail, password: registerPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      if (status === 201){
        toast.success("Usuário Cadastrado com sucesso!");
        navigate("/"); 
 
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Cadastro</h2>
        <div className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700"
          >
            Cadastrar
          </button>

          <div className="mt-4 text-center">
            <span className="text-gray-600">Já tem uma conta?</span>{" "}
            <a
              href="/"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Faça login aqui
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
