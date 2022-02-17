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
                comment_count: 2,
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
      it('"Status 404, when requesting and article_id that does not currently exist"', () => {
        return request(app)
          .get("/api/articles/999999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 400, when requesting with an article_id that is incorrect", () => {
        return request(app)
          .get("/api/articles/not_an_id/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("POST", () => {
      it("Status 201, accepts object to input into comments table and returns comment", () => {
        return request(app)
          .post("/api/articles/4/comments")
          .send({
            username: "icellusedkars",
            body: `this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it`,
          })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                article_id: 4,
                comment_id: 19,
                votes: 0,
                created_at: expect.any(String),
                author: "icellusedkars",
                body: "this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it",
              })
            );
          });
      });
      it("Status 404, when requesting to comment on an article that does not currently exist", () => {
        return request(app)
          .post("/api/articles/99999999/comments")
          .send({
            username: "icellusedkars",
            body: `this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it`,
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 400, when article id is a bad input", () => {
        return request(app)
          .post("/api/articles/not_an_id/comments")
          .send({
            username: "icellusedkars",
            body: `this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it`,
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, no username in body", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            body: `this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it`,
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, no body in body", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "icellusedkars",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
  });
  describe("/api/articles/ (comment count)", () => {
    describe("GET", () => {
      it("Status 200, endpoint should now respond with a comment count for each article", () => {
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
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/articles/ (queries)", () => {
    describe(".GET", () => {
      it("Status 200, allow for client to sort by a valid column ", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("title", {
              descending: true,
            });
          });
      });
      it("Status 200, allow for client to choose between ASC and DESC order", () => {
        return request(app)
          .get("/api/articles?order=ASC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at");
          });
      });
      it("Status 200, Allow for filtering topics by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: "mitch",
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      it("Status 400, when an invalid sort_by query is set", () => {
        return request(app)
          .get("/api/articles?sort_by=not_a_column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid sort query");
          });
      });
      it("Status 400, when an invalid order query is set", () => {
        return request(app)
          .get("/api/articles?order=not_an_order")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid order query");
          });
      });
      it("Status 404, when an invalid topic filter is input", () => {
        return request(app)
          .get("/api/articles?topic=not_a_topic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 404, when a topic is valid but there are no articles for that topic", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no articles found for this topic");
          });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      it("Status 204, deletes comment", () => {
        return request(app)
          .delete(`/api/comments/2`)
          .expect(204)
          .then(() => {});
      });
      it("Status 404, comment not found", () => {
        return request(app)
          .delete(`/api/comments/9999`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 400, invalid comment id is passed", () => {
        return request(app)
          .delete(`/api/comments/not_an_id`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
  });
});
