function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function mockExternalApi(id) {
    return {
      id,
      data: "processed",
    };
  }
  
  module.exports = { delay, mockExternalApi };
  