import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterPoll: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions((prev) => [...prev, '']);
  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const { status } = await axios.post(
        'http://localhost:3000/poll',
        { title, description, options },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === 201){
        toast.success("Poll criada com sucesso!");
        setTitle('');
        setDescription('');
        setOptions(['']);
        navigate("/polls")
      }

    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      <button
        onClick={() => navigate('/Polls')}
        className="fixed top-4 left-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Voltar
      </button>

      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Criar Nova Enquete
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Título"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descrição"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Opções</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 hover:underline"
            >
              + Adicionar opção
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold transition hover:bg-gray-800"
          >
            Criar Enquete
          </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPoll;
