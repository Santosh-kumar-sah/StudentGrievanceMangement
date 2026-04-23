import Grievance from "../models/grievance.model.js";

// Refactor: Grievance controller for student grievance management.
export const createGrievance = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description and category are required" });
    }

    const grievance = new Grievance({
      user: req.student.id,
      title,
      description,
      category,
      status
    });

    const savedGrievance = await grievance.save();

    return res.status(201).json({
      message: "Grievance created successfully",
      grievance: savedGrievance
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.student.id }).sort({ date: -1 });
    return res.status(200).json(grievances);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getGrievanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const grievance = await Grievance.findOne({ _id: id, user: req.student.id });

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json(grievance);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance id" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description and category are required" });
    }

    const updatedGrievance = await Grievance.findOneAndUpdate(
      { _id: id, user: req.student.id },
      {
        title,
        description,
        category,
        status: status || "Pending"
      },
      { new: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json({
      message: "Grievance updated successfully",
      grievance: updatedGrievance
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance id" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteGrievance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGrievance = await Grievance.findOneAndDelete({
      _id: id,
      user: req.student.id
    });

    if (!deletedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    return res.status(200).json({ message: "Grievance deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance id" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const searchGrievances = async (req, res) => {
  try {
    const { title = "" } = req.query;

    const grievances = await Grievance.find({
      user: req.student.id,
      title: { $regex: title, $options: "i" }
    }).sort({ date: -1 });

    return res.status(200).json(grievances);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};