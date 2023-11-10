const Division = require('../model/Division');
const User = require('../model/User');

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "Success",
      message: "Successfully fetch all user data",
      users: users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        angkatan: user.angkatan,
        divisionId: user.divisionId
      }))
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: `User with id ${userId} is not existed`
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully fetch user data",
      user: {
        id: user.id,
        fullName: user.fullName,
        angkatan: user.angkatan,
        divisionId: user.divisionId
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
};

const postUser = async (req, res, next) => {
  try {
    const {
      fullName, nim, angkatan, email, password, division
    } = req.body;

    const userDivision = await Division.findOne({
      where: {
        name: division
      }
    });

    if (!userDivision) {
      return res.status(400).json({
        status: "Error",
        message: `${division} is not existed`
      });
    }

    const currentUser = await User.create({
      fullName,
      email,
      password,
      angkatan,
      nim,
      divisionId: userDivision.id
    });

    res.status(201).json({
      status: "success",
      message: "Successfully create User",
      user: {
        fullName: currentUser.fullName,
        division: division
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: `User with id ${userId} is not existed`
      });
    }

    await user.destroy();

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  getAllUser, getUserById, postUser, deleteUser
};
