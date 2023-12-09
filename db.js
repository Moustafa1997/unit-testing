exports.getOrder = (orderId) => {
  return {
    id: orderId,
    price: 120,
  };
};
exports.updateOrder = (order) => {
  console.log("order is updated");
};

exports.getUser = async (userId) => {
  return {
    id: userId,
    name: "joe",
    email: "j@j.com",
  };
};
exports.insertOrder = async (userId, products) => {
  console.log("order is inserted");
};
