import knex from "knex";

const database = knex({
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  useNullAsDefault: true,
  debug: true,
  log: {
    debug: ({ sql, bindings }) => console.log(`[QUERY] ${sql}`, bindings),
  },
});

export default database;
