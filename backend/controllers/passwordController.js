const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const sendResetEmail = require("../services/sendResetEmail");
const logger = require("../logger"); 

exports.forgotPasswordHandler = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn({ email }, "User not found for password reset");
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await sendResetEmail(user.email, token);

    logger.info({ email }, "Password reset link sent");
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    logger.error({ err: error }, "Error during forgotPasswordHandler");
    res.status(500).json({ message: "Error sending reset link" });
  }
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn({ token }, "Invalid or expired reset token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    logger.info({ token, email: user.email }, "Valid reset token");
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    logger.error({ err: error }, "Error validating reset token");
    res.status(500).json({ message: "Error validating token" });
  }
};

exports.resetPasswordHandler = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    logger.warn("Password not provided in reset request");
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn({ token }, "Invalid or expired token during reset");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info({ email: user.email }, "Password successfully reset");
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error({ err: error }, "Error resetting password");
    res.status(500).json({ message: "Error resetting password" });
  }
};
exports.changePasswordHandler = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; 

  if (!currentPassword || !newPassword || !confirmPassword) {
    logger.warn("Missing required fields for changing password");
    return res.status(400).json({ message: "Current password, new password, and confirmation are required" });
  }

  if (newPassword !== confirmPassword) {
    logger.warn("New password and confirmation do not match");
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn({ userId }, "User not found");
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      logger.warn({ userId }, "Incorrect current password");
      return res.status(400).json({ message: "Incorrect current password" });
    }
   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
    user.password = hashedPassword;
    await user.save();

    logger.info({ userId }, "Password successfully changed");
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    logger.error({ err: error }, "Error changing password");
    res.status(500).json({ message: "Error changing password" });
  }
};