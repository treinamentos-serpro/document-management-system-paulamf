// Controller de documentos: trata entrada/saída HTTP e validação básica.

const path = require('path');
const fs = require('fs');
const documentsService = require('../services/documents.service');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

function requireOwner(req, res, next) {
  if (!req.header('X-User-Id')) {
    return res.status(400).json({ erro: 'Cabeçalho X-User-Id é obrigatório' });
  }
  return next();
}

function upload(req, res) {
  const ownerId = req.header('X-User-Id');

  if (!ownerId) {
    return res.status(400).json({ erro: 'Cabeçalho X-User-Id é obrigatório' });
  }
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  }

  try {
    const document = documentsService.registerDocument({ ownerId, file: req.file });
    return res.status(201).json(document);
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({ erro: error.message });
  }
}

function list(req, res) {
  const ownerId = req.header('X-User-Id');

  if (!ownerId) {
    return res.status(400).json({ erro: 'Cabeçalho X-User-Id é obrigatório' });
  }

  const documents = documentsService.listDocumentsByOwner(ownerId);
  return res.json(documents);
}

function download(req, res) {
  const { id } = req.params;
  const ownerId = req.header('X-User-Id');

  if (!ownerId) {
    return res.status(400).json({ erro: 'Cabeçalho X-User-Id é obrigatório' });
  }

  try {
    const document = documentsService.getDocumentById(id, ownerId);
    const filePath = path.resolve(STORAGE_DIR, document.storedName);
    const storagePrefix = `${path.resolve(STORAGE_DIR)}${path.sep}`;

    if (!filePath.startsWith(storagePrefix)) {
      return res.status(404).json({ erro: 'Arquivo não encontrado no armazenamento' });
    }

    return res.download(filePath, document.originalName, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({ erro: 'Arquivo não encontrado no armazenamento' });
      }
    });
  } catch (error) {
    return res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  requireOwner,
  upload,
  list,
  download,
};
