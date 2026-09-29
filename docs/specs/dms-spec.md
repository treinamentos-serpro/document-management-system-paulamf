# Especificação - Document Management System

## 1. Objetivo

Entregar um sistema web para que usuários possam enviar, listar e baixar
documentos armazenados exclusivamente no filesystem local da aplicação.

## 2. Escopo

### Dentro do escopo

- Upload de documentos.
- Listagem dos documentos pertencentes ao usuário.
- Download de documentos por identificador.
- Associação de documentos a um usuário.
- Validação básica de arquivos enviados.
- Interface React para upload, listagem e download.
- Metadados mantidos em memória.
- Arquivos armazenados localmente com `multer` e `diskStorage`.
- Testes automatizados dos principais fluxos da API.

### Fora do escopo

- Armazenamento externo, cloud storage ou serviços de terceiros.
- Banco de dados.
- Autenticação e autorização completas.
- Versionamento de documentos.
- Exclusão ou edição de documentos.
- Compartilhamento entre usuários.
- Pré-visualização de arquivos.
- Busca avançada, paginação ou ordenação configurável.
- Conversão ou processamento do conteúdo dos documentos.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O usuário pode enviar um documento usando `multipart/form-data`. |
| RF-02 | O sistema deve rejeitar requisições de upload sem arquivo. |
| RF-03 | O sistema deve gerar um identificador único para cada documento. |
| RF-04 | O arquivo deve ser salvo em `backend/storage`. |
| RF-05 | O sistema deve manter em memória os metadados do documento. |
| RF-06 | O usuário pode listar seus documentos. |
| RF-07 | A listagem deve retornar somente documentos associados ao usuário informado. |
| RF-08 | O usuário pode baixar um documento pelo identificador. |
| RF-09 | O download deve retornar o conteúdo binário do arquivo. |
| RF-10 | O download deve preservar o nome original do documento. |
| RF-11 | O sistema deve retornar erro apropriado para documentos inexistentes. |
| RF-12 | O sistema deve informar erros de validação em formato JSON. |
| RF-13 | O frontend deve permitir selecionar e enviar um arquivo. |
| RF-14 | O frontend deve exibir os documentos disponíveis ao usuário. |
| RF-15 | O frontend deve disponibilizar uma ação de download para cada documento. |
| RF-16 | O sistema deve manter o endpoint `GET /health` funcionando. |

### Identificação do usuário

Nesta fase, o usuário será identificado pelo cabeçalho HTTP:

```http
X-User-Id: <identificador-do-usuario>