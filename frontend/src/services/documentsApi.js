// Cliente HTTP para a API de documentos do backend (prefixo /api via proxy do Vite).

const API_BASE_URL = '/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.erro || 'Erro ao comunicar com o servidor');
  }
  return data;
}

export async function uploadDocument(file, userId) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: formData,
  });

  return parseResponse(response);
}

export async function listDocuments(userId) {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    headers: { 'X-User-Id': userId },
  });

  return parseResponse(response);
}

export function getDownloadUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/download`;
}

export async function downloadDocument(documentId, userId, fileName) {
  const response = await fetch(getDownloadUrl(documentId), {
    headers: { 'X-User-Id': userId },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.erro || 'Erro ao baixar o documento');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
