const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data");
const seed = require("../db/seeds/seed");

afterAll(() => connection.end());
beforeEach(() => seed(data));

describe("The Server", () => {
  test('Status 404, msg: "path not found" when invalid endpoint entered', () => {
    return request(app)
      .get("/Not-An-API")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
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
  describe("/api/articles/article_id", () => {
    describe(".GET", () => {
      it("Status 200, returns body with specific article object", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: expect.any(String),
                votes: 0,
              })
            );
          });
      });
    });
  });
});
