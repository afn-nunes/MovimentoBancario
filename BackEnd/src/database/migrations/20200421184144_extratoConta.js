
exports.up = function (knex) {
  return knex.schema.createTable('extratoConta', function(table){ 
      table.increments();   
      table.integer('idDadosBancarios').notNullable();        
      table.timestamp('data').notNullable();
      table.string('descricao').notNullable();
      table.decimal('valor').notNullable();
      table.string('tpMovimento').notNullable();

      table.foreign('idDadosBancarios').references('id').inTable('dadosBancarios');      
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('extratoBancario');
}