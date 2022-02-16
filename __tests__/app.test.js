const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data");
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
                created_at: "2020-10-16T05:03:00.000Z",
                votes: 0,
              })
            );
          });
      });
      it("Status 404, valid input for article that does not exist", () => {
        return request(app)
          .get("/api/articles/9999999")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("resource not found");
          });
      });
      it('Status 400, msg: "bad request"', () => {
        return request(app)
          .get("/api/articles/not_an_id")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
    });
    describe(".PATCH", () => {
      it("Status 201, and returns body with article object with added votes", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: 10 })
          .expect(201)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                article_id: 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 10,
              })
            );
          });
      });
      it("Status 201, and returns body with article object with added votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(201)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 90,
              })
            );
          });
      });
      it("Status 404, valid id type but the article does not exist", () => {
        return request(app)
          .patch("/api/articles/99999")
          .send({ inc_votes: 10 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("resource not found");
          });
      });
      it("Status 400, invalid id type is passed", () => {
        return request(app)
          .patch("/api/articles/not_an_id")
          .send({ inc_votes: 10 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("Status 400, no inc_votes on request body", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ not_correct: 10 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("Status 400, invalid inc_votes", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: "not_number" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      it("Status 200, returns an object with an array of objects containing usernames", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((res) => {
            expect(res.body.users).toHaveLength(4);
            expect(res.body.users).toEqual([
              { username: "butter_bridge" },
              { username: "icellusedkars" },
              { username: "rogersop" },
              { username: "lurker" },
            ]);
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      it("Status 200, returns an object containing an array of objects sorted by date in desc order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toHaveLength(12);
            res.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
  });
  describe("/api/articles/:article:id (comment count)", () => {
    describe("GET", () => {
      it("Status 200, endpoint should now respond with a comment count", () => {
        return request(app)
          .get("/api/articles/9")
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                article_id: 9,
                title: "They're not exactly dogs, are they?",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at: "2020-06-06T09:10:00.000Z",
                votes: 0,
                comment_count: "2",
              })
            );
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      it("Status 200, responds with an object containing an array of comment objects for article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      it("Status 200, when requesting comments from an existing article with no comments returns obj with empty array", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(0);
            expect(comments).toEqual([]);
          });
      });
    });
  });
});
