import { useState } from 'react';
import { downloadDocument } from '../services/documentsApi';

export default function DownloadButton({ documentId, fileName, userId }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDownload() {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadDocument(documentId, userId, fileName);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <button className="download-button" type="button" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
