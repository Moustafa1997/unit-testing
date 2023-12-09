const {
  sum,
  concat,
  iseven,
  unique,
  getOrderById,
  getEvenNumbers,
  getOddNumbers,
  getDiscount,
  createOrder,
  fetchData,
} = require("./utils");
const db = require("./db");
const axios = require("axios");
const email = require("./email");
//to mock a module

jest.mock("axios");
// test number
describe("sum", () => {
  it("should return 2+3=5", () => {
    const result = sum(2, 3);
    expect(result).toBe(5);
    expect(result).toBeGreaterThan(4);
    // if we used a float number
    expect(sum(0.102, 0.3)).toBeCloseTo(0.4);
  });
  it("should return 5+5=10", () => {
    expect(sum(5, 5)).toBe(10);
  });
});

// test string
describe("concat", () => {
  test("concat should return a string", () => {
    const result = concat("2", "3");
    expect(result).toBe("23");
    expect(() => concat(2, 3)).toThrow("arguments must be strings");

    expect(typeof result).toBe("string");
    // using to match instead tobe as to be you must put exact data a
    expect(result).toMatch(/23/);
  });
});

//test boolean
describe("is Even", () => {
  test("is even -should return true for 4", () => {
    expect(iseven(4)).toBeTruthy();
    expect(iseven(3)).toBe(false);
  });
});

// test un defined , valdation for variables
describe("validation", () => {
  test("validation", () => {
    let x = 10;
    let y;
    let z = null;
    expect(x).toBeDefined();
    expect(y).toBeUndefined();
    expect(z).toBeNull();
  });
});

// test array
describe("unique", () => {
  test("should remove duplicate elements from an array", () => {
    const arr = [1, 2, 2, 3, 4, 4, 5];
    const result = unique(arr);
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
    expect(result).toContain(1);
  });
});
// test object
describe("getOrderBy Id", () => {
  it(" should return the correct object", () => {
    const obj = {
      id: 1,
      name: "John",
    };
    const result = getOrderById(obj);
    expect(result).toMatchObject(obj);
  });
  it("shoud return the prperty obj.id", () => {
    const obj = {
      id: 1,
      name: "John",
    };
    const result = getOrderById(obj);
    expect(result).toHaveProperty("id", 1);
  });
});
//test async
describe("getEvenNumbers", () => {
  it("should return even numbers", async () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = await getEvenNumbers(numbers);
    expect(result).toEqual([2, 4]);
  });
});
describe("get odd number", () => {
  it("should return odd numbers", async () => {
    const num = [1, 2, 2, 3, 4];
    await expect(getOddNumbers(num)).resolves.toEqual([1, 3]);
  });
});
//test get discount , here we used mok
describe("get discount", () => {
  it("should return discount", async () => {
    //  db.getOrder = jest.fn().mockReturnValueOnce({ id: 1, price: 120 });
    //! implementaion mock
    db.getOrder = jest.fn().mockImplementation((id) => {
      if (id < 5) {
        return { id, price: 120 };
      }
      return {
        id,
        price: 90,
      };
    });

    db.updateOrder = jest.fn();
    const result = await getDiscount(1);
    expect(result).toEqual({ id: 1, price: 108 });
    expect(db.getOrder.mock.calls.length).toBe(1);
    //! mock property
    // this function when we call it in first time what is paramter are sent to it
    expect(db.updateOrder.mock.calls[0][0]).toEqual({ id: 1, price: 108 });
    //console.log(db.getOrder.mock);
    // to check if function is callled with ?
    expect(db.updateOrder).toBeCalledWith({ id: 1, price: 108 });
    //!reset Mock
    //db.getOrder.mockReset();
    //db.updateOrder.mockReset();
  });
  it("should not applay discount for price 90", async () => {
    const order = await getDiscount(60);
    expect(order).toEqual({
      id: 60,
      price: 90,
    });
  });
});

// how to mock a module
describe("fetch data", () => {
  it("should return data", async () => {
    axios.get.mockResolvedValue({ id: 1 });
    const data = await fetchData();
    expect(data).toEqual({ id: 1 });
  });
});

describe("create order", () => {
  it("shoud thow error if userId not found", async () => {
    await expect(createOrder()).rejects.toThrow("user not found");
  });
  it("should create order", async () => {
    db.insertOrder = jest.fn();
    db.getUser = jest.fn().mockResolvedValue({
      email: "j@j.com",
    });
    email.sendEmail = jest.fn();
    const message = await createOrder(5, [
      {
        price: 10,
      },
      {
        price: 20,
      },
    ]);
    expect(db.insertOrder).toBeCalledWith(5, [
      {
        price: 10,
      },
      {
        price: 20,
      },
    ]);
    expect(email.sendEmail).toBeCalledWith("j@j.com", 30);
    expect(db.getUser.mock.calls.length).toBe(1);
    expect(db.getUser.mock.calls[0][0]).toBe(5);
    expect(message).toMatch(
      `Order created, Total price: 30 and products:[{"price":10},{"price":20}]`
    );
  });
});
