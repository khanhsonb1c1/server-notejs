const UserDAO = require("../../DAO/user.DAO");

const authService = {
  login: async (email, password) => {
    try {
      console.log(email, password);
      const user_data = await UserDAO.getUserByEmail(email);
      if (user_data.password == password) {
        return {
          status: true,
          message: "Loginn successfully",
          data: user_data,
        };
      } else {
        throw new Error("Password fail");
      }
    } catch (error) {
      throw new Error(error); 
    }
  },
  changePassword: async (email, oldPassword, newPassword) => {
    try {
      const user_data = await UserDAO.getUserByEmail(email);

      console.log(user_data, "user data");

      if (user_data.password == oldPassword) {
        await UserDAO.updateUser(user_data._id, {
          password: newPassword,
        });

        return {
          status: true,
        };
      } else {
        return new Error({
          status: false,
          message: "Old password fail",
        });
      }
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  },
};

module.exports = authService;
