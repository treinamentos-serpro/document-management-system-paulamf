import DownloadButton from './DownloadButton';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString('pt-BR');
}

export default function DocumentList({ documents, isLoading, error }) {
  if (isLoading) {
    return <p className="document-list__status">Carregando documentos...</p>;
  }

  if (error) {
    return <p className="document-list__status document-list__status--error">{error}</p>;
  }

  if (documents.length === 0) {
    return <p className="document-list__status">Nenhum documento enviado ainda.</p>;
  }

  return (
    <ul className="document-list">
      {documents.map((document) => (
        <li key={document.id} className="document-list__item">
          <div className="document-list__info">
            <span className="document-list__name">{document.originalName}</span>
            <span className="document-list__meta">
              {formatSize(document.size)} • {formatDate(document.createdAt)}
            </span>
          </div>
          <DownloadButton documentId={document.id} fileName={document.originalName} />
        </li>
      ))}
    </ul>
  );
}
