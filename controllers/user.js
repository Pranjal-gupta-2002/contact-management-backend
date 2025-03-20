import { Contact } from "../models/contact.js";
import { Team } from "../models/team.js";
import { User } from "../models/user.js";
import { generateToken } from "../utils/features.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email }); // ✅ Use await
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    generateToken(newUser, 201, res, "User registered successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user, 200, res, `Welcome back ${user.name}`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,  // Ensure your server is running over HTTPS
      sameSite: 'None',  // Required for cross-origin cookies
    }).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    // Make sure the search term exists
    const searchTerm = req.params.name || "";

    // Convert to string explicitly to ensure $regex works properly
    const searchString = String(searchTerm);
    console.log(searchString);
    const user = await User.find({
      email: { $regex: searchString, $options: "i" },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const userGetAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const userGet = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export const userUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const userDelete = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Find and delete the user
      const user = await User.findOneAndDelete({ _id: req.params.id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // No need to save after findOneAndDelete
      // await user.save(); - This line should be removed

      // Find teams where user is a member
      const teams = await Team.find({ members: req.params.id });

      // Update each team by removing the user
      for (const team of teams) {
        team.members = team.members.filter(
          (member) => member.toString() !== req.params.id
        );
        await team.save();
      }

      // Find and delete user's contacts
      // findMany should be find
      const contacts = await Contact.find({ creater: req.params.id, groupId: null });

      // Delete each contact
      for (const contact of contacts) {
        await Contact.findOneAndDelete({ _id: contact._id });
      }

      return res.status(200).clearCookie().json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this user" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changeRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "user" ? "admin" : "user";
    await user.save();

    return res.status(200).json({ message: "User role updated successfully", updatedUser: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
