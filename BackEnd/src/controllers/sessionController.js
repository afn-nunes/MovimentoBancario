const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const { id } = request.body;

        const conta = await connection('dadosBancarios')
        .where('id', id)
        .select('banco', 'agencia', 'conta')
        .first();

        if (!conta){
            return response.status(400).json({ error: 'Conta não encontrada'});
        }

        return response.json(conta);
    }
}