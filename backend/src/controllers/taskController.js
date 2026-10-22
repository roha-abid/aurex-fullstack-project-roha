const mongoose = require("mongoose");
const Task = require("../models/Task");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Only these fields may be set by the client. "user" is NEVER taken from the body.
const pickAllowed = (body) => {
  const allowed = {};
  ["title", "description", "status", "priority"].forEach((field) => {
    if (body[field] !== undefined) allowed[field] = body[field];
  });
  return allowed;
};

// CREATE
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...pickAllowed(req.body), user: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// READ ALL (only the logged-in user's tasks)
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// READ ONE
const getTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// UPDATE (edit fields or mark complete via { "status": "completed" })
const updateTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      pickAllowed(req.body),
      { new: true, runValidators: true },
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
