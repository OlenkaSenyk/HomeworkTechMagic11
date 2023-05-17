import User from "../models/user.model.js";
import Article from "../models/article.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const sortByAge = req.query.sortByAge;
    const result = await User.find({}, "_id fullName email age").sort({
      age: sortByAge,
    });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await User.findById(
      id,
      "_id fullName email age articles"
    ).populate("articles", "title subtitle createdAt -_id");
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, age } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      age,
    });
    const result = await user.save();
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, age } = req.body;

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      age,
      fullName: `${firstName} ${lastName}`,
    });

    const result = await user.save();
    return res.status(200).json({ message: "User was updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id);
    await Article.deleteMany({ owner: id });
    return res
      .status(200)
      .json({ message: "User and his articles were deleted" });
  } catch (err) {
    next(err);
  }
};
