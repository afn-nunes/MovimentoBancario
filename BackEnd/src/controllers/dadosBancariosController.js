const crypto = require('crypto');
const connection = require('../database/connection');
module.exports = {
    async index(request, response){
      const dadosBancarios = await connection ('dadosBancarios').select('*');
        return response.json(dadosBancarios);
    },   
    async create(request, response) {
      const {id, banco, agencia, conta} = request.body;
      await connection('dadosBancarios').insert({
        id, banco, agencia, conta
    })

    return response.json({ id });
    }
}

