import { getDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ documentId, fileName }) {
  return (
    <a className="download-button" href={getDownloadUrl(documentId)} download={fileName}>
      Baixar
    </a>
  );
}
