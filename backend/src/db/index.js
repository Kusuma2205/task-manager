const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:cnHIMTMgiyVzfdwdNpodSbxWPOCNIFpH@tramway.proxy.rlwy.net:14049/railway',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;