// Repositório de documentos: persiste metadados em memória.
// Os arquivos em si são gravados no filesystem pelo multer (diskStorage),
// este módulo cuida apenas dos metadados (id, nome original, tamanho, data, dono).

const documents = [];

function create(document) {
  documents.push(document);
  return document;
}

function findAllByOwner(ownerId) {
  return documents.filter((document) => document.ownerId === ownerId);
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = {
  create,
  findAllByOwner,
  findById,
};
