const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const { id } = request.body;

        const extrato = await connection('extratoConta')
        .where('idDadosBancarios', id)
        .select('data', 'descricao', 'valor', 'tpMovimento')
        .first();
        if (!extrato){
            return response.status(400).json({ error: 'Extrato não encontrada'});
        }

        return response.json(extrato);
    }
}

