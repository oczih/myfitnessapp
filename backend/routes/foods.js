import express from 'express';
const router = express.Router();

router.get('/search-food', async (req, res) => {
  const query = req.query.q || 'banana';
  try {
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
    
    if (!response.ok) {
      throw new Error(`OpenFoodFacts API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Optionally map the data to return only relevant fields
    const results = data.products.map(product => ({
      product_name: product.product_name,
      brands: product.brands,
      nutrients: product.nutriments,
      image: product.image_front_small_url,
    }));

    res.json({ count: data.count, products: results });
  } catch (err) {
    console.error('Error fetching from OpenFoodFacts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
