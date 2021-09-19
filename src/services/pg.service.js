const { Pool } = require('pg');
const { parse } = require('pg-connection-string');
const dotenv = require('dotenv');
const { format } = require('./string');
const path = require('path');
const datefns = require('date-fns');

dotenv.config();

const certPath = path.resolve(__dirname, '../../',
  process.env.CERT_PATH);
const config = parse(format(process.env.PGURL, [certPath]));
config.port = process.env.PGPORT;
config.database = process.env.PGDATABASE;
const pool = new Pool(config);

exports.pool = pool;

exports.isoToTimestamp = function (isoDate) {
  return datefns.format(isoDate, 'yyyy-MM-dd HH:mm:ss.SSSSSS');
}