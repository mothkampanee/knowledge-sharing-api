// Create PostgreSQL Connection Pool here !
import "dotenv/config";
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DB_URL,
});

export default connectionPool;
