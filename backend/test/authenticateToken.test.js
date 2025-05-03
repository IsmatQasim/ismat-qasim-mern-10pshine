const chai = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const expect = chai.expect;

const authenticateToken = require("../middleware/authenticateUser"); // update path

describe("authenticateToken middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      sendStatus: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 401 if no token is provided", () => {
    authenticateToken(req, res, next);
    expect(res.sendStatus.calledWith(401)).to.be.true;
  });

  it("should return 403 if token is invalid", () => {
    req.headers["authorization"] = "Bearer invalidtoken";
    sinon.stub(jwt, "verify").callsFake((token, secret, cb) => cb(new Error("Invalid"), null));

    authenticateToken(req, res, next);
    expect(res.sendStatus.calledWith(403)).to.be.true;
  });

  it("should call next() and set req.user if token is valid", () => {
    req.headers["authorization"] = "Bearer validtoken";
    const fakeUser = { id: 1 };
    sinon.stub(jwt, "verify").callsFake((token, secret, cb) => cb(null, fakeUser));

    authenticateToken(req, res, next);
    expect(req.user).to.eql(fakeUser);
    expect(next.calledOnce).to.be.true;
  });
});
