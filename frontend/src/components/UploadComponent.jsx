import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ userId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] ?? null);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError('Selecione um arquivo antes de enviar');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      await uploadDocument(selectedFile, userId);
      setSelectedFile(null);
      event.target.reset();
      await onUploadSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="upload-form__label" htmlFor="file-input">
        Selecione um documento
      </label>
      <div className="upload-form__controls">
        <input id="file-input" type="file" onChange={handleFileChange} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </div>
      {error && <p className="upload-form__error">{error}</p>}
    </form>
  );
}
