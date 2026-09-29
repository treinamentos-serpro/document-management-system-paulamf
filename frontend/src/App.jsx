import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/documentsApi';
import './App.css';

const USER_ID_STORAGE_KEY = 'dms:userId';

export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem(USER_ID_STORAGE_KEY) || '');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = useCallback(async () => {
    if (!userId) {
      setDocuments([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await listDocuments(userId);
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function handleUserIdChange(event) {
    const value = event.target.value;
    setUserId(value);
    localStorage.setItem(USER_ID_STORAGE_KEY, value);
  }

  return (
    <main className="app">
      <h1 className="app__title">Document Management System</h1>

      <section className="app__user">
        <label htmlFor="user-id-input">Usuário</label>
        <input
          id="user-id-input"
          type="text"
          placeholder="Informe seu identificador de usuário"
          value={userId}
          onChange={handleUserIdChange}
        />
      </section>

      {userId ? (
        <>
          <section className="app__section">
            <h2>Enviar documento</h2>
            <UploadComponent userId={userId} onUploadSuccess={loadDocuments} />
          </section>

          <section className="app__section">
            <h2>Meus documentos</h2>
            <DocumentList documents={documents} isLoading={isLoading} error={error} />
          </section>
        </>
      ) : (
        <p className="app__hint">Informe um identificador de usuário para começar.</p>
      )}
    </main>
  );
}
