const sinon = require("sinon");
const nodemailer = require("nodemailer");
const sendResetEmail = require("../services/sendResetEmail"); 

describe("sendResetEmail", () => {
  let sendMailStub;

  beforeEach(() => {
    sendMailStub = sinon.stub().resolves();
    sinon.stub(nodemailer, "createTransport").returns({
      sendMail: sendMailStub
    });

    // Mock env variables
    process.env.EMAIL_USER = "testuser@gmail.com";
    process.env.EMAIL_PASS = "testpass";
    process.env.FRONTEND_URL = "http://localhost:3000";
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send a reset email with the correct parameters", async () => {
    const email = "user@example.com";
    const token = "testtoken";

    await sendResetEmail(email, token);

    const expectedUrl = `http://localhost:3000/reset-password/${token}`;

    sinon.assert.calledWith(sendMailStub, sinon.match({
      to: email,
      subject: "Password Reset",
      html: sinon.match.string.and(sinon.match(value => value.includes(expectedUrl)))
    }));
  });
});
