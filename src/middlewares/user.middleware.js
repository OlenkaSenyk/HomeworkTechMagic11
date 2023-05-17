import User from "../models/user.model.js";

export const checkUserExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
