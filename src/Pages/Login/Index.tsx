import {useEffect} from 'react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu as MenuIcon, ChevronDown, User } from 'lucide-react';

// 1. Fade-in Sticky Header with Slide Down Navigation
export const Header1: React.FC = () => (
  <motion.header
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="sticky top-0 bg-white shadow-md py-4 px-6 md:px-12 z-50"
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <motion.div whileHover={{ scale: 1.1 }} className="text-2xl font-extrabold">
        MyBrand
      </motion.div>
      <nav className="hidden md:flex space-x-8">
        {['Home','About','Services','Contact'].map(link => (
          <motion.a
            key={link}
            href="#"
            whileHover={{ color: '#3B82F6' }}
            className="text-gray-700 font-medium hover:underline"
          >
            {link}
          </motion.a>
        ))}
      </nav>
      <div className="md:hidden">
        <MenuIcon size={24} />
      </div>
    </div>
  </motion.header>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Inicializa o Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'SEU_APP_ID_DO_FACEBOOK', // substitua pelo seu App ID real
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
    };
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Senha:', password);
  };

  // 2. Função de login com Facebook
  const handleFacebookLogin = () => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email' }, function (userInfo: any) {
          console.log('Usuário logado com Facebook:', userInfo);
          alert(`Bem-vindo, ${userInfo.name}!`);
        });
      } else {
        console.log('Login com Facebook cancelado ou não autorizado');
      }
    }, { scope: 'email' });
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Header1></Header1>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Entrar
          </button>
        </form>

        {/* Botão de login com Facebook */}
        <div className="mt-4 text-center">
          <p className="text-gray-500">ou</p>
          <button
            onClick={handleFacebookLogin}
            className="mt-2 w-full bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition"
          >
            Entrar com Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
