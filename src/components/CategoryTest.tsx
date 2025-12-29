import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transactionService';

export default function CategoryTest() {
  const [categories, setCategories] = useState<Array<{id: string, name: string, type: 'income' | 'expense'}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await transactionService.getAllCategories();
      
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-4">Teste de Categorias</h3>
      
      <button 
        onClick={loadCategories}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Carregando...' : 'Recarregar Categorias'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <strong>Total de categorias:</strong> {categories.length}
      </div>

      {categories.length > 0 ? (
        <div>
          <h4 className="font-semibold mb-2">Categorias de Saída:</h4>
          <ul className="mb-4">
            {categories.filter(cat => cat.type === 'expense').map(cat => (
              <li key={cat.id} className="text-sm">- {cat.name}</li>
            ))}
          </ul>

          <h4 className="font-semibold mb-2">Categorias de Entrada:</h4>
          <ul>
            {categories.filter(cat => cat.type === 'income').map(cat => (
              <li key={cat.id} className="text-sm">- {cat.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-gray-500">
          Nenhuma categoria encontrada. Verifique se o script foi executado.
        </div>
      )}
    </div>
  );
}
