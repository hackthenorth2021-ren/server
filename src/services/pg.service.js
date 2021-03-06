const { Pool } = require('pg');
const { parse } = require('pg-connection-string');
const dotenv = require('dotenv');
const { format } = require('./string');
const path = require('path');
const datefns = require('date-fns');

dotenv.config();

let config = {};
try {
  const certPath = path.resolve(__dirname, '../../',
    process.env.CERT_PATH);
  config = parse(format(process.env.PGURL, [certPath]));
  config.port = process.env.PGPORT;
  config.database = process.env.PGDATABASE;
} catch (err) {
  config = {};
  console.log('FAILED TO LOAD DATABASE CONFIG', err);
}

const pool = new Pool(config);
exports.pool = pool;

exports.isoToTimestamp = function (isoDate) {
  return datefns.format(isoDate, 'yyyy-MM-dd HH:mm:ss.SSSSSS');
}

exports.performMultiQuery = async function performMultiQuery(multiQuery) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await multiQuery(client);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}