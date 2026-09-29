// Regras de negócio de documentos.

const crypto = require('crypto');
const documentsRepository = require('../repositories/documents.repository');

function registerDocument({ ownerId, file }) {
  if (!ownerId) {
    throw new Error('ownerId é obrigatório');
  }
  if (!file) {
    throw new Error('arquivo é obrigatório');
  }

  const document = {
    id: crypto.randomUUID(),
    ownerId,
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  return documentsRepository.create(document);
}

function listDocumentsByOwner(ownerId) {
  if (!ownerId) {
    throw new Error('ownerId é obrigatório');
  }
  return documentsRepository.findAllByOwner(ownerId);
}

function getDocumentById(id, ownerId) {
  const document = documentsRepository.findById(id);
  if (!document) {
    throw new Error('documento não encontrado');
  }
  if (ownerId && document.ownerId !== ownerId) {
    throw new Error('documento não encontrado');
  }
  return document;
}

module.exports = {
  registerDocument,
  listDocumentsByOwner,
  getDocumentById,
};
