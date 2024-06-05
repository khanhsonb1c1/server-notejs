const { User } = require("../../models/user/UserModal");

const userController = {
  create: async (req, res) => {
    try {
      const newUser = new User({
        id: req.body.id,
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });

      const saveUser = await newUser.save();

      res.status(200).json({
        message: "add new user successfully.",
        data: saveUser,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  fetch: async (req, res) => {
    try {
      const user = await User.find().select('-password');
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const user = await User.findById( req.params.id).populate("favoriteMusics");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.find({id: req.params.id});
      await user.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      await User.findOneAndDelete({id: req.params.id});
      res.status(200).json("Delete successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
