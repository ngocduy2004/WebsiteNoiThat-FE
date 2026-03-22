const { default: httpAxios } = require("./httpAxios");

const AttributeService = {
  // Get all available attributes (for the form)
  getList: () => httpAxios.get("/attributes"),

  // Get product attributes for a specific product
  getProductAttributes: (productId) => httpAxios.get(`/products/${productId}/attributes`),

  // Create/update product attributes
  saveProductAttributes: (productId, attributesData) => {
    return httpAxios.post(`/products/${productId}/attributes`, attributesData);
  },

  // Delete product attribute
  deleteProductAttribute: (productId, attributeId) => {
    return httpAxios.delete(`/products/${productId}/attributes/${attributeId}`);
  }
};

export default AttributeService;