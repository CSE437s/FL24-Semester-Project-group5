const { getClient } = require('./get-client');

(async () => {
  const client = await getClient();
  const name = process.argv[2] ?? 'john';
  let insertRow = await client.query('INSERT INTO my_table(name) VALUES($1);', [`${name}`]);
  console.log(`Inserted ${insertRow.rowCount} row`);
  await client.end();
})();

// to use this file call "./sql_connections/add-data.js" in your terminal or cmd line