const crypto = require('crypto');
const connection = require('../database/connection');
module.exports = {
    async index(request, response){
      const [soma] = await connection('extratoConta').sum('valor');       
      const extrato = await connection ('extratoConta')
        .join('dadosBancarios', 'dadosBancarios.id', '=', 'extratoConta.idDadosBancarios')
        .select(['extratoConta.*', 'dadosBancarios.agencia', 'dadosBancarios.conta', 'dadosBancarios.banco']);
        response.proper
        response.header('x-total-value', soma.sum);  

        return response.json(extrato);
    },   
    async create(request, response) {
      const {idDadosBancarios, data, descricao, valor, tpMovimento} = request.body;
      await connection('extratoConta').insert({
        idDadosBancarios, data, descricao, valor, tpMovimento  
    })

    return response.json({ idDadosBancarios });
    }
}

