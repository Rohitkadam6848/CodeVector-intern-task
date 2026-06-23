const pool = require("../db");

// Get products with cursor pagination and category filter
exports.getProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const category = req.query.category;

    const cursorUpdated = req.query.updated_at;
    const cursorId = req.query.id;

    let query = `
      SELECT *
      FROM products
    `;

    const params = [];
    let idx = 1;

    if (category) {
      query += ` WHERE category = $${idx}`;
      params.push(category);
      idx++;
    } else {
      query += ` WHERE TRUE`;
    }

    if (cursorUpdated && cursorId) {
      query += `
        AND (
          updated_at < $${idx}
          OR
          (
            updated_at = $${idx}
            AND id < $${idx + 1}
          )
        )
      `;
      params.push(cursorUpdated);
      params.push(cursorId);
      idx += 2;
    }

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT $${idx}
    `;

    params.push(limit);

    const result = await pool.query(query, params);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const last = result.rows[result.rows.length - 1];
      nextCursor = {
        updated_at: last.updated_at,
        id: last.id,
      };
    }

    res.json({
      products: result.rows,
      nextCursor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Guardrail: Ensure required fields are provided
    if (!name || !category || !price) {
      return res
        .status(400)
        .json({ message: "Name, category, and price are required." });
    }

    const result = await pool.query(
      `
      INSERT INTO products
      (name, category, price, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
      `,
      [name, category, price],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(`\n--- DEBUGGING DELETE ---`);
    console.log(`1. Express received request to delete ID: "${id}"`);

    // Let's ask the database if it can even see this ID before we try to delete it
    const checkProduct = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id],
    );
    console.log(
      `2. Database check found ${checkProduct.rowCount} row(s) for this ID.`,
    );

    if (checkProduct.rowCount === 0) {
      console.log(
        `3. ERROR: The Express server cannot see ID ${id} in the database it is connected to.`,
      );
      // Let's check how many total products Express CAN see
      const total = await pool.query(`SELECT COUNT(*) FROM products`);
      console.log(
        `4. The total number of products Express can see is: ${total.rows[0].count}`,
      );
    }

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Search products
exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    // Guardrail: Ensure keyword exists so it doesn't search for "undefined"
    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Please provide a search keyword." });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE LOWER(name) LIKE LOWER($1)
      ORDER BY updated_at DESC
      LIMIT 50
      `,
      [`%${keyword}%`],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
