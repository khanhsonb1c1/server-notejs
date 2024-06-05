const authService = require("../../services/auth/auth.service");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const status = await authService.login(email, password);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


   changePassword: async (req, res) => {
    try {
      const email = req.params.email;
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(email, oldPassword, newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message, status: false });
    }
  }

 
};

module.exports = authController;
