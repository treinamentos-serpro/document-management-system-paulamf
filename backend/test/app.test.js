const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('faz upload de documentos e retorna seus metadados', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  let storedPath;

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo de teste'], { type: 'text/plain' }), '../../../../outside.txt');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'X-User-Id': 'user-a' },
      body: formData,
    });
    const document = await uploadResponse.json();

    assert.strictEqual(uploadResponse.status, 201);
    assert.strictEqual(document.originalName, 'outside.txt');
    assert.strictEqual(document.size, 17);
    assert.match(document.storedName, /^[0-9a-f-]+\.txt$/);
    storedPath = path.resolve(__dirname, '..', 'storage', document.storedName);
    assert.ok(storedPath.startsWith(path.resolve(__dirname, '..', 'storage') + path.sep));
    assert.ok(fs.existsSync(storedPath));
  } finally {
    if (storedPath) {
      fs.rmSync(storedPath, { force: true });
    }
    await new Promise((resolve) => server.close(resolve));
  }
});

test('lista apenas os documentos do proprietário', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  let storedPath;

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['lista'], { type: 'text/plain' }), 'lista.txt');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'X-User-Id': 'user-a' },
      body: formData,
    });
    const document = await uploadResponse.json();
    storedPath = path.resolve(__dirname, '..', 'storage', document.storedName);

    const listResponse = await fetch(`${baseUrl}/documents`, {
      headers: { 'X-User-Id': 'user-a' },
    });
    const documents = await listResponse.json();

    assert.strictEqual(listResponse.status, 200);
    assert.ok(documents.some((item) => item.id === document.id));
    assert.ok(documents.every((item) => item.ownerId === 'user-a'));

    const otherOwnerResponse = await fetch(`${baseUrl}/documents`, {
      headers: { 'X-User-Id': 'user-b' },
    });
    assert.deepStrictEqual(await otherOwnerResponse.json(), []);
  } finally {
    if (storedPath) {
      fs.rmSync(storedPath, { force: true });
    }
    await new Promise((resolve) => server.close(resolve));
  }
});

test('baixa um documento apenas para o proprietário', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  let storedPath;

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo de download'], { type: 'text/plain' }), 'download.txt');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'X-User-Id': 'download-owner' },
      body: formData,
    });
    const document = await uploadResponse.json();
    storedPath = path.resolve(__dirname, '..', 'storage', document.storedName);

    const unauthorizedResponse = await fetch(`${baseUrl}/documents/${document.id}/download`, {
      headers: { 'X-User-Id': 'other-owner' },
    });
    assert.strictEqual(unauthorizedResponse.status, 404);

    const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`, {
      headers: { 'X-User-Id': 'download-owner' },
    });
    assert.strictEqual(downloadResponse.status, 200);
    assert.strictEqual(await downloadResponse.text(), 'conteudo de download');
  } finally {
    if (storedPath) {
      fs.rmSync(storedPath, { force: true });
    }
    await new Promise((resolve) => server.close(resolve));
  }
});
