const developmentData = require("./development-data");
const testData = require("./test-data");
const ENV = process.env.NODE_ENV || "development";

let data;

if (ENV === "development") {
  data = developmentData;
} else {
  data = testData;
}

module.exports = data;