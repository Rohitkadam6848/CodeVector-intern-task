const pool = require("./db");

const categories = ["Electronics", "Clothing", "Books", "Sports", "Furniture"];

async function seed() {
  const values = [];

  for (let i = 1; i <= 200000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];

    const price = (Math.random() * 10000).toFixed(2);

    values.push(
      `(
                'Product ${i}',
                '${category}',
                ${price},
                NOW() - INTERVAL '${Math.floor(Math.random() * 365)} days',
                NOW() - INTERVAL '${Math.floor(Math.random() * 365)} days'
            )`,
    );
  }

  const query = `
    INSERT INTO products
    (name,category,price,created_at,updated_at)
    VALUES
    ${values.join(",")}
    `;

  await pool.query(query);

  console.log("Inserted 200000 products");

  process.exit();
}

seed();
