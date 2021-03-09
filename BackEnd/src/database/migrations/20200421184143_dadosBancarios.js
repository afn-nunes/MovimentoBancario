

exports.up = function (knex) {
  return knex.schema.createTable('dadosBancarios', function(table){
      table.increments('');
      table.string('agencia').notNullable();
      table.string('conta').notNullable();
      table.string('banco').notNullable();
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('dadosBancarios');
}