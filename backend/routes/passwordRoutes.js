const express = require('express');
const { forgotPasswordHandler, resetPasswordHandler, validateResetToken ,changePasswordHandler } = require('../controllers/passwordController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateUser');


router.get("/reset-password/:token", validateResetToken);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password/:token", resetPasswordHandler);
router.post("/change-password", authenticateToken, changePasswordHandler);



module.exports = router;
