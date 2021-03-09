# MovimentoBancario
Sistema criado para permitir a atualização dos dados do banco a partir da importação do extrato bancário.

Após baixar o código fonte, abrir o diretório backend no visual studio code.
Abrir o diretório Backend no visual studio code.
remover a pasta node_modules e o arquivo package-lock.json, depois abrir o terminal e executar o comando npm ínstall (Necessário ter instalado o node).
Após executar o comando deverá ser possível executar npm start, que inicializará o serviço do backend.

Repetir o processo na pasta FrontEnd.

A criação do banco de dados é feita de forma automática. Configure os dados da instância no arquivo connectionString encontrado em 'src/backend/database'(É necessário configurar uma instância do postgres para a criação do banco de dados).
Para isso execute no terminal do visual studio code o comando: **knex migrate:latest**

Será aberto o site http://localhost:3000/

![image](https://user-images.githubusercontent.com/39346584/110536446-3db22400-8100-11eb-9e97-8274a1317533.png)

O saldo é calculado no momento em que o extrato é salvo no banco de dados. * No primeiro momento, para gravação do extrato no banco de dados, é necessário ter uma conta bancária já cadastrada.
Ao importar vários extratos, o saldo será incrementado de acordo com as entradas/saidas.

Um recurso adicional é a visualização da cotação de 3 moedas no rodapé da tela. Esse recurso consome uma api com a contação em tempo real dessas moedas.

Euro, Dollar, BitCoin
![image](https://user-images.githubusercontent.com/39346584/110537781-e614b800-8101-11eb-96a4-d06db6524e25.png)
