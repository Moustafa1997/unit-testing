const axios = require("axios");
const db = require("./db");
const email = require("./email");
//number
exports.sum = (x, y) => x + y;

// stings
exports.concat = (str1, str2) => {
  if (typeof str1 !== "string" || typeof str2 !== "string") {
    throw new Error("arguments must be strings");
  }
  //str1.concat(str2)
  return str1.concat(str2);
};
// boolens
exports.iseven = (number) => {
  return number % 2 === 0 ? true : false;
};
//arrays/**
/* Removes duplicate elements from an array.
 * @param {Array} arr - The input array.
 * @returns {Array} - The array with duplicate elements removed.
 */
exports.unique = (arr) => {
  return [...new Set(arr)];
};
//objects
exports.getOrderById = (obj) => {
  return {
    id: obj.id,
    name: obj.name,
  };
};
// async functions to return even numbers
// async function to return even numbers
exports.getEvenNumbers = async (numbers) => {
  return numbers.filter((num) => num % 2 === 0);
};
// asyn to return odd num
exports.getOddNumbers = async (numbers) => {
  return numbers.filter((num) => num % 2 !== 0);
};

//asyn  to apply discount
exports.getDiscount = async (orderId) => {
  // these is a external dependancy we cant test it with unit test so we used mock // fack a result for these result
  const order = db.getOrder(orderId);
  if (order.price > 100) {
    order.price -= order.price * 0.1;
  }
  db.updateOrder(order);
  return order;
};
//
exports.fetchData = async () => {
  const data = await axios.get("https://url.com");
  return data;
};

// function to create order
exports.createOrder = async (userId, products) => {
  if (!userId) throw new Error("user not found");
  let totalPrice = 0;
  products.forEach((product) => {
    totalPrice += product.price;
  });
  await db.insertOrder(userId, products);
  const user = await db.getUser(userId);
  email.sendEmail(user.email, totalPrice);
  return `Order created, Total price: ${totalPrice} and products:${JSON.stringify(
    products
  )}`;
};
