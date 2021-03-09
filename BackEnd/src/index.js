const express = require('express')
const cors = require('cors');
const routes = require('./routes');
const corsOptions = {
  exposedHeaders: 'x-total-value',
};


const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(routes);

app.listen('3333');