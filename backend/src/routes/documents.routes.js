// Rotas de documentos: define os endpoints e delega ao controller.

const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const documentsController = require('../controllers/documents.controller');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

router.post(
  '/upload',
  documentsController.requireOwner,
  upload.single('file'),
  documentsController.upload,
);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
