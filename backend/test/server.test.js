const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../server");
const User = require("../models/user");

const logger = require("../logger");
const originalLoggerError = logger.error;
logger.error = () => {};

chai.use(chaiHttp);
const { expect } = chai;

describe("API Endpoints Testing", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    logger.error = originalLoggerError;
  });

  it("should sign up a new user and return a token", (done) => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    sandbox.stub(User, "findOne").resolves(null);
    sandbox.stub(User.prototype, "save").resolves();

    chai
      .request(app)
      .post("/signup")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should log in with valid credentials and return a token", (done) => {
    const loginData = {
      email: "johndoe@example.com",
      password: "password123",
    };

    const user = {
      _id: "609b6e1f25f0a5b7a9836f95",
      email: "johndoe@example.com",
      password: "$2a$10$H1.dFwwDWlt8.9RI/x/ZbufqowNjJvnxOfl9UgCOXzZC5deLOm12K",
    };

    sandbox.stub(User, "findOne").resolves(user);
    sandbox.stub(bcrypt, "compare").resolves(true);

    chai
      .request(app)
      .post("/login")
      .send(loginData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should return an error for invalid credentials", (done) => {
    const loginData = {
      email: "johndoe@example.com",
      password: "wrongpassword",
    };

    const user = {
      _id: "609b6e1f25f0a5b7a9836f95",
      email: "johndoe@example.com",
      password: "$2a$10$H1.dFwwDWlt8.9RI/x/ZbufqowNjJvnxOfl9UgCOXzZC5deLOm12K",
    };

    sandbox.stub(User, "findOne").resolves(user);
    sandbox.stub(bcrypt, "compare").resolves(false);

    chai
      .request(app)
      .post("/login")
      .send(loginData)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property("message")
          .that.equals("Invalid credentials");
        done();
      });
  });

  it("should return user profile for valid token", (done) => {
    const validToken = jwt.sign(
      { id: "609b6e1f25f0a5b7a9836f95" },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "1h" }
    );

    const userQueryMock = {
      select: sinon.stub().returns({
        _id: "609b6e1f25f0a5b7a9836f95",
        name: "John Doe",
        email: "johndoe@example.com",
      }),
    };

    sandbox.stub(User, "findById").returns(userQueryMock);
    sandbox.stub(jwt, "verify").returns({ id: "609b6e1f25f0a5b7a9836f95" });

    chai
      .request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("name").that.equals("John Doe");
        expect(res.body)
          .to.have.property("email")
          .that.equals("johndoe@example.com");
        done();
      });
  });

  it("should return an error for invalid token", (done) => {
    const invalidToken = "invalidtoken";

    sandbox.stub(jwt, "verify").throws(new Error("Invalid token"));

    chai
      .request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${invalidToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property("message")
          .that.equals("Invalid token");
        done();
      });
  });

  it("should return an error for missing token", (done) => {
    chai
      .request(app)
      .get("/profile")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property("message")
          .that.equals("Access denied. No token provided.");
        done();
      });
  });
});
