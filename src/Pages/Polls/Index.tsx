import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface Option {
  id: string;
  text: string;
}

interface Poll {
  id: number;
  title: string;
  description: string;
  options: Option[];
}

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<{ [pollId: string]: string }>({});
  const navigate = useNavigate();
  const pageSize = 1;

  // Busca enquetes com paginação
  const fetchPolls = async (page: number) => {
    try {
      const { data } = await axios.get('http://localhost:3000/poll', {
        params: { page, limit: pageSize },
      });
  
      // Verifica se o array de enquetes está vazio e se não estamos na primeira página
      if (data.length === 0 && page > 1) {
        setCurrentPage((prev) => prev - 1); // Volta para a última página válida
      } else {
        setPolls(data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Erro ao buscar enquetes:', error);
    }
  };

  useEffect(() => {
    fetchPolls(currentPage);
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleVote = async (pollId: number) => {
    const optionId = selectedOption[pollId];
    if (!optionId) {
      alert('Selecione uma opção antes de votar!');
      return;
    }

    const token = localStorage.getItem('token');
    
    console.log(token)
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/poll/vote',
        { optionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      // Atualiza a lista após o voto
      fetchPolls(currentPage);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Exibe mensagem específica de conflito (usuário já votou)
        if (error.response.status === 409 && error.response.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Erro ao registrar voto!');
        }
      } else {
        alert('Erro ao registrar voto!');
      }
      console.error('Erro ao registrar voto:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between px-6 pt-4 mb-10 relative">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="absolute top-0 left-0 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          Sair
        </button>
        <h1 className="text-4xl font-bold text-gray-700 mx-auto">Enquetes</h1>
        <Link
          to="/RegisterPoll"
          className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          + Nova Enquete
        </Link>
      </div>

      <ul className="space-y-4">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{poll.title}</h2>
            <p className="text-lg text-gray-600 mb-6">{poll.description}</p>
            <div className="space-y-4">
              {poll.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption[poll.id] === opt.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    className="form-radio h-5 w-5 text-blue-600"
                    checked={selectedOption[poll.id] === opt.id}
                    onChange={() =>
                      setSelectedOption((prev) => ({ ...prev, [poll.id]: opt.id }))
                    }
                  />
                  <span className="ml-4 text-gray-800 font-medium">{opt.text}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => handleVote(poll.id)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Votar
            </button>
          </div>
        ))}
      </ul>

      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Polls;
