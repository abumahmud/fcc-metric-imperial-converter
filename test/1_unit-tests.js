// tests/1_unit-tests.js

const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("Whole number input", function () {
    assert.equal(convertHandler.getNum("32L"), 32);
  });

  test("Decimal number input", function () {
    assert.equal(convertHandler.getNum("3.2mi"), 3.2);
  });

  test("Fractional input", function () {
    assert.equal(convertHandler.getNum("3/2km"), 1.5);
  });

  test("Fractional input with decimal", function () {
    assert.equal(convertHandler.getNum("5.4/3lbs"), 1.8);
  });

  test("Double-fraction input should return error", function () {
    assert.isNull(convertHandler.getNum("3/2/3gal"));
  });

  test("Default to 1 when no number is provided", function () {
    assert.equal(convertHandler.getNum("kg"), 1);
  });

  test("Valid unit inputs", function () {
    const inputUnits = ["gal", "l", "mi", "km", "lbs", "kg"];
    inputUnits.forEach((u) => {
      assert.include(
        ["gal", "L", "mi", "km", "lbs", "kg"],
        convertHandler.getUnit("10" + u)
      );
    });
  });

  test("Invalid unit input", function () {
    assert.isNull(convertHandler.getUnit("32g"));
  });

  test("Return unit for each valid input", function () {
    const pairs = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs",
    };
    for (let key in pairs) {
      assert.equal(convertHandler.getReturnUnit(key), pairs[key]);
    }
  });

  test("Spell out each unit correctly", function () {
    const pairs = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    for (let key in pairs) {
      assert.equal(convertHandler.spellOutUnit(key), pairs[key]);
    }
  });

  test("Convert gal to L", function () {
    assert.approximately(convertHandler.convert(1, "gal"), 3.78541, 0.1);
  });

  test("Convert L to gal", function () {
    assert.approximately(convertHandler.convert(3.78541, "L"), 1, 0.1);
  });

  test("Convert mi to km", function () {
    assert.approximately(convertHandler.convert(1, "mi"), 1.60934, 0.1);
  });

  test("Convert km to mi", function () {
    assert.approximately(convertHandler.convert(1.60934, "km"), 1, 0.1);
  });

  test("Convert lbs to kg", function () {
    assert.approximately(convertHandler.convert(1, "lbs"), 0.453592, 0.1);
  });

  test("Convert kg to lbs", function () {
    assert.approximately(convertHandler.convert(0.453592, "kg"), 1, 0.1);
  });
});
