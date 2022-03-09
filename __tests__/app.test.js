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
    describe(".POST", () => {
      it("Status 201, adds topic to topics table", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: "Sheep", description: "woolly things" })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: "Sheep",
                description: "woolly things",
              })
            );
          });
      });
      it("Status 400, invalid slug", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: null, description: "woolly things" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, missing slug", () => {
        return request(app)
          .post("/api/topics")
          .send({ description: "woolly things" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
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
                created_at: expect.any(String),
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
                created_at: expect.any(String),
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
    describe(".DELETE", () => {
      it("Status 204, removes article from articles table", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {});
      });
      it("Status 404, articles not found", () => {
        return request(app)
          .delete(`/api/articles/9999`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 400, invalid article id is passed", () => {
        return request(app)
          .delete(`/api/articles/not_an_id`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
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
            expect(res.body.articles).toHaveLength(10);
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
    describe("POST", () => {
      it("Status 201, adds an article to articles table", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 13,
                author: "icellusedkars",
                title: "Sheep",
                body: `The sheep did it`,
                topic: "cats",
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0,
              })
            );
          });
      });
      it("Status 404, username valid but does not exist", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "not_a_name",
            title: "Sheep",
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 404, topic valid but does not exist", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            body: `The sheep did it`,
            topic: "not_a_topic",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      it("Status 404, body invalid", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            body: null,
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, title invalid", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: null,
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, author invalid", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: null,
            title: "Sheep",
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, topic invalid", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            body: `The sheep did it`,
            topic: null,
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, author missing from send", () => {
        return request(app)
          .post("/api/articles")
          .send({
            title: "Sheep",
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, title missing from send", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            body: `The sheep did it`,
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, body missing from send", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            topic: "cats",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("Status 400, topic missing from send", () => {
        return request(app)
          .post("/api/articles")
          .send({
            username: "icellusedkars",
            title: "Sheep",
            body: `The sheep did it`,
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
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
                created_at: expect.any(String),
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
            expect(comments).toHaveLength(10);
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
      it("Status 400, username is null", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: null,
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
      it("Status 400, body is null", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "icellusedkars",
            body: null,
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      it("status 400, not a username", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "not_a_username",
            body: `this might be the greatest masterpiece I have ever read. I mean sheep, who would have guessed it`,
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
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
            expect(res.body.articles).toHaveLength(10);
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
  describe("/api/users/:username", () => {
    describe("GET", () => {
      it("Status 200, responds with an object containing username, avatar_url and name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: "rogersop",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                name: "paul",
              })
            );
          });
      });
      it("Status 404, when a username that is valid but does not exist is input", () => {
        return request(app)
          .get("/api/users/not_a_username")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
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
      it("Status 404, when a topic filter is input that doesn't match current topics", () => {
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
    describe("PATCH", () => {
      it("Status 201, and returns body with comment object with added votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String),
                votes: 17,
              })
            );
          });
      });
      it("Status 201, and returns body with comment object with added votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String),
                votes: 15,
              })
            );
          });
      });
      it("Status 404, valid id type but the comment does not exist", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 10 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("resource not found");
          });
      });
      it("Status 400, invalid id type is passed", () => {
        return request(app)
          .patch("/api/comments/not_an_id")
          .send({ inc_votes: 10 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("Status 400, no inc_votes on request body", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ not_correct: 10 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
      it("Status 400, invalid inc_votes", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: "not_number" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("bad request");
          });
      });
    });
  });
  describe("/api", () => {
    describe("GET", () => {
      it("Status 200, returns with contents of endpoints.json", () => {
        return request(app)
          .get(`/api`)
          .expect(200)
          .then(({ body: { api } }) => {
            expect(api).toEqual(
              expect.objectContaining({
                "GET /api": {
                  description:
                    "serves up a json representation of all the available endpoints of the api",
                },
                "GET /api/topics": {
                  description: "serves an array of all topics",
                  queries: [],
                  exampleResponse: {
                    topics: [{ slug: "football", description: "Footie!" }],
                  },
                },
                "GET /api/articles": {
                  description: "serves an array of all articles",
                  queries: ["topic", "sort_by", "order"],
                  exampleResponse: {
                    articles: [
                      {
                        title: "Seafood substitutions are increasing",
                        topic: "cooking",
                        author: "weegembump",
                        created_at: 1527695953341,
                        votes: 2,
                      },
                    ],
                  },
                },
                "GET /api/articles/:article_id": {
                  description: "serves and object containing an article",
                  queries: [],
                  exampleResponse: {
                    article: {
                      title: "Seafood substitutions are increasing",
                      topic: "cooking",
                      author: "weegembump",
                      body: "Text from the article..",
                      created_at: 1527695953341,
                      votes: 2,
                    },
                  },
                },
                "PATCH /api/articles/:article_id": {
                  description:
                    "updates the votes property of an article and returns the article",
                  queries: [],
                  exampleRequest: {
                    inc_votes: 1,
                  },
                  exampleResponse: {
                    article: {
                      title: "Seafood substitutions are increasing",
                      topic: "cooking",
                      author: "weegembump",
                      body: "Text from the article..",
                      created_at: 1527695953341,
                      votes: 3,
                    },
                  },
                },
                "GET /api/users": {
                  description: "serves an array of all users",
                  queries: [],
                  exampleResponse: {
                    users: [{ username: "icellusedkars" }],
                  },
                },
                "GET /api/articles/:article_id/comments": {
                  description: "serves all comments relating to a article_id",
                  queries: [],
                  exampleResponse: {
                    comments: [
                      {
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 16,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: 1586179020000,
                      },
                    ],
                  },
                },
                "POST /api/articles/:article_id/comments": {
                  description:
                    "inserts a new comment into the comments table then serves the comment as a response",
                  queries: [],
                  exampleRequest: {
                    username: "butter_bridge",
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  },
                  exampleResponse: {
                    comment: {
                      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                      votes: 16,
                      author: "butter_bridge",
                      article_id: 9,
                      created_at: 1586179020000,
                    },
                  },
                },
                "DELETE /api/comments/:comments_id": {
                  description:
                    "removes a comment with a particular comment id from the comments table",
                  queries: [],
                  exampleResponse: "no content",
                },
              })
            );
          });
      });
    });
  });
  describe(" /api/articles (pagination)", () => {
    describe("GET", () => {
      it("Status 200, endpoint now limits the amount of articles returned to specified number", () => {
        return request(app)
          .get(`/api/articles?limit=2`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(2);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  full_count: 12,
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      it("Status 200, limit defaults to 10", () => {
        return request(app)
          .get(`/api/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  full_count: 12,
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      it("Status 200, endpoint can now offset which page to start at", () => {
        return request(app)
          .get(`/api/articles?offset=1`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(2);
            expect(articles[0]).toEqual(
              expect.objectContaining({
                article_id: 11,
                title: "Am I a cat?",
                topic: "mitch",
                author: "icellusedkars",
                created_at: expect.any(String),
                votes: 0,
                full_count: 12,
                comment_count: 0,
              })
            );
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  full_count: 12,
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      it("Status 200, offset defaults to 0", () => {
        return request(app)
          .get(`/api/articles?`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
            expect(articles[0]).toEqual(
              expect.objectContaining({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                created_at: expect.any(String),
                votes: 0,
                full_count: 12,
                comment_count: 2,
              })
            );
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  full_count: 12,
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      it("Status 400, when an invalid limit query is set", () => {
        return request(app)
          .get("/api/articles?limit=not_a_number")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid limit query");
          });
      });
      it("Status 400, when an invalid offset query is set", () => {
        return request(app)
          .get("/api/articles?offset=not_an_offset")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid offset query");
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments (pagination)", () => {
    describe("GET", () => {
      it("Status 200, endpoint now limits the amount of comments returned to specified number", () => {
        return request(app)
          .get(`/api/articles/1/comments?limit=5`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(5);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  full_count: 11,
                })
              );
            });
          });
      });
      it("Status 200, limit defaults to 10", () => {
        return request(app)
          .get(`/api/articles/1/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  full_count: 11,
                })
              );
            });
          });
      });
      it("Status 200, endpoint can now offset which page to start at", () => {
        return request(app)
          .get(`/api/articles/1/comments?offset=1`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(1);
            expect(comments[0]).toEqual(
              expect.objectContaining({
                article_id: 1,
                comment_id: 9,
                votes: 0,
                created_at: expect.any(String),
                author: "icellusedkars",
                body: "Superficially charming",
                full_count: 11,
              })
            );
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  full_count: 11,
                })
              );
            });
          });
      });
      it("Status 200, offset defaults to 0", () => {
        return request(app)
          .get(`/api/articles/1/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
            expect(comments[0]).toEqual(
              expect.objectContaining({
                article_id: 1,
                comment_id: 5,
                votes: 0,
                created_at: expect.any(String),
                author: "icellusedkars",
                body: "I hate streaming noses",
                full_count: 11,
              })
            );
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  full_count: 11,
                })
              );
            });
          });
      });
      it("Status 400, when an invalid limit query is set", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=not_a_number")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid limit query");
          });
      });
      it("Status 400, when an invalid offset query is set", () => {
        return request(app)
          .get("/api/articles/1/comments?offset=not_an_offset")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid offset query");
          });
      });
    });
  });
});
