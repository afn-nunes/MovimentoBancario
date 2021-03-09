

exports.up = function (knex) {
  return knex.schema.createTable('cotacaoMoeda', function(table){
      table.increments();

      table.date('data').notNullable();
      table.string('moeda').notNullable();
      table.decimal('cotacaoVenda').notNullable();
      table.decimal('cotacaoCompra').notNullable();
      table.decimal('variacao').notNullable();
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('cotacaoMoeda');
}