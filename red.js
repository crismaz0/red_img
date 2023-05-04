const axios = require('axios');

// Configura la información de autenticación de tu tienda Shopify
const shopifyConfig = {
  apiKey: 'c8953f6e72df1460596137cbb6e43552',
  password: 'fe0f85242becd3943413f939b4ba55b4',
  storeUrl: 'https://gadgetsyvariedades.myshopify.com',
};

// Función para redimensionar una imagen
async function resizeImage(imageUrl, width, height) {
  try {
    const resizedImageUrl = `https://gadgetsyvariedades.myshopify.com/tools/resize/${width}x${height}/${
      imageUrl.split('?')[0]
    }`;
    const response = await axios.get(resizedImageUrl);
    return response.data;
  } catch (error) {
    console.error('Error al redimensionar la imagen:', error);
    throw error;
  }
}

// Función para redimensionar las imágenes de los productos
async function resizeProductImages(collectionId, width, height) {
  try {
    // Obtén la lista de productos en la colección
    const productsResponse = await axios.get(
      `${shopifyConfig.storeUrl}/admin/api/2021-07/collections/${collectionId}/products.json`,
      {
        auth: {
          username: shopifyConfig.apiKey,
          password: shopifyConfig.password,
        },
      }
    );

    const products = productsResponse.data.products;

    // Redimensiona las imágenes de cada producto
    for (const product of products) {
      for (const image of product.images) {
        const resizedImage = await resizeImage(image.src, width, height);
        image.src = resizedImage;
      }
    }

    // Actualiza los productos con las imágenes redimensionadas
    await axios.put(
      `${shopifyConfig.storeUrl}/admin/api/2021-07/products.json`,
      { products },
      {
        auth: {
          username: shopifyConfig.apiKey,
          password: shopifyConfig.password,
        },
      }
    );

    console.log('Imágenes redimensionadas correctamente.');
  } catch (error) {
    console.error('Error al redimensionar las imágenes de los productos:', error);
  }
}

// Ejemplo de uso: redimensiona las imágenes de una colección con ID "1234567890" a un tamaño de 500x500
resizeProductImages('434690294074', 722, 805);
