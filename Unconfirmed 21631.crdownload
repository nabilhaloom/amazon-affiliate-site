// Netlify Function for managing affiliate links
exports.handler = async (event, context) => {
  // Mock database - in production use MongoDB or similar
  const affiliateLinks = {
    "product1": "https://amzn.to/3xample1",
    "product2": "https://amzn.to/3xample2",
    "product3": "https://amzn.to/3xample3"
  };

  try {
    const { productId } = event.queryStringParameters;
    
    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Product ID is required" })
      };
    }
    
    const affiliateLink = affiliateLinks[productId];
    
    if (!affiliateLink) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Product not found" })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ affiliateLink })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};