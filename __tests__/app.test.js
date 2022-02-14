const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data");
const seed = require("../db/seeds/seed");

afterAll(() => connection.end());
beforeEach(() => seed(data));

describe("app.js", () => {
  describe("/api/topics", () => {
    describe(".GET", () => {
      it("Status 200, returns body with topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics).toHaveLength(3);
            res.body.topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
});
