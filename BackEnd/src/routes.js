const express = require('express');
const extratoController = require('./controllers/extratoController');
const dadosBancariosController = require('./controllers/dadosBancariosController');
const sessionController = require('./controllers/sessionController');
const sessionExtratoController = require('./controllers/sessionExtratoController');
const importExtratoController = require('./controllers/importExtratoController');
const routes = express.Router();

routes.post('/extrato', extratoController.create);
routes.get('/extrato', extratoController.index);
routes.post('/dadosbancarios', dadosBancariosController.create);
routes.get('/dadosbancarios', dadosBancariosController.index);
routes.post('/sessions', sessionController.create);
routes.post('/sessionsextrato', sessionExtratoController.create);
routes.post('/ofx', importExtratoController.index);
module.exports = routes;

