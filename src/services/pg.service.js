const { Pool } = require('pg');
const { parse } = require('pg-connection-string');
const dotenv = require('dotenv');

dotenv.config();

const config = parse(process.env.PGURL);
config.port = process.env.PGPORT;
config.database = process.env.PGDATABASE;
const pool = new Pool(config);

module.exports = pool;