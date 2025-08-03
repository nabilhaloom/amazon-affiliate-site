
// functions/affiliate-links.js
exports.handler = async (event, context) => {
  // In production, this would connect to a database
  const affiliateLinks = {
    "product1": "https://amzn.to/3xample1",
    "product2": "https://amzn.to/3xample2",
    "product3": "https://amzn.to/3xample3",
    "product4": "https://amzn.to/3xample4",
    "product5": "https://amzn.to/3xample5",
    "product6": "https://amzn.to/3xample6",
    "product7": "https://amzn.to/3xample7",
    "product8": "https://amzn.to/3xample8"
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
