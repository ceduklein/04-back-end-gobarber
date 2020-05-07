import { createConnection } from 'typeorm';

createConnection();
// esta função vai procurar em todo projeto o arquivo ormconfig.json
// este arquivo contém as credenciais para acesso ao banco de dados.
