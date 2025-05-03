const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const server = require("../server");
const { expect } = chai;

chai.use(chaiHttp);
dotenv.config();

const testUser = { id: "validUserId" };

describe("Password Routes", () => {
  it("should return 401 if token is missing", (done) => {
    chai
      .request(server)
      .post("/api/auth/change-password")
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 400 if currentPassword is missing", (done) => {
    chai
      .request(server)
      .post("/api/auth/change-password")
      .set(
        "Authorization",
        `Bearer ${jwt.sign(testUser, process.env.JWT_SECRET)}`
      )
      .send({
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 400 if newPassword is missing", (done) => {
    chai
      .request(server)
      .post("/api/auth/change-password")
      .set(
        "Authorization",
        `Bearer ${jwt.sign(testUser, process.env.JWT_SECRET)}`
      )
      .send({
        currentPassword: "currentpassword",
        confirmPassword: "newpassword123",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 400 if confirmPassword is missing", (done) => {
    chai
      .request(server)
      .post("/api/auth/change-password")
      .set(
        "Authorization",
        `Bearer ${jwt.sign(testUser, process.env.JWT_SECRET)}`
      )
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword123",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 400 if newPassword and confirmPassword do not match", (done) => {
    chai
      .request(server)
      .post("/api/auth/change-password")
      .set(
        "Authorization",
        `Bearer ${jwt.sign(testUser, process.env.JWT_SECRET)}`
      )
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword123",
        confirmPassword: "differentpassword123",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
