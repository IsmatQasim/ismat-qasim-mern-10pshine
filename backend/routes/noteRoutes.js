const express = require("express");
const Note = require("../models/note");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateUser');
const logger = require('../logger'); // custom logger, not pino

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content, status, favorite } = req.body;
    const newNote = new Note({
      title,
      content,
      status,
      user: req.user.id,
      favorite: favorite || false,
    });
    await newNote.save();
    logger.info(`User ${req.user.id} created a note titled "${newNote.title}"`);
    res.status(201).json(newNote);
  } catch (error) {
    logger.error(`Error creating note for user ${req.user.id}`, error);
    res.status(500).json({ message: "Error creating note" });
  }
});

router.get("/getNotes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    logger.info(`User ${req.user.id} fetched all their notes`);
    res.status(200).json(notes);
  } catch (error) {
    logger.error(`Error fetching notes for user ${req.user.id}`, error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content, status, favorite } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id, 
      { title, content, status, favorite }, 
      { new: true }
    );
    if (!note) {
      logger.warn(`User ${req.user.id} tried to update non-existing note with id ${req.params.id}`);
      return res.status(404).json({ message: "Note not found" });
    }
    logger.info(`User ${req.user.id} updated note titled "${note.title}"`);
    res.status(200).json({ id: note._id, ...note.toObject() });
  } catch (error) {
    logger.error(`Failed to update note ${req.params.id} for user ${req.user.id}`, error);
    res.status(400).json({ message: "Failed to update note", error });
  }
});

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      logger.warn(`User ${req.user.id} tried to delete non-existing note with id ${req.params.id}`);
      return res.status(404).json({ message: "Note not found" });
    }
    await note.deleteOne();
    logger.info(`User ${req.user.id} deleted note titled "${note.title}"`);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete note ${req.params.id} for user ${req.user.id}`, error);
    res.status(400).json({ message: "Failed to delete note", error });
  }
});

router.patch("/status/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!note) {
      logger.warn(`User ${req.user.id} tried to change status of non-existing note with id ${req.params.id}`);
      return res.status(404).json({ message: "Note not found" });
    }
    logger.info(`User ${req.user.id} changed status of note titled "${note.title}"`);
    res.status(200).json({ id: note._id, ...note.toObject() });
  } catch (error) {
    logger.error(`Failed to update status for note ${req.params.id} for user ${req.user.id}`, error);
    res.status(400).json({ message: "Failed to update status", error });
  }
});

router.patch("/favorite/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      logger.warn(`User ${req.user.id} tried to favorite non-existing note with id ${req.params.id}`);
      return res.status(404).json({ message: "Note not found" });
    }

    const { favorite } = req.body;
    if (typeof favorite !== 'boolean') {
      logger.warn(`User ${req.user.id} provided invalid favorite value for note titled "${note.title}"`);
      return res.status(400).json({ message: "Invalid value for favorite, must be a boolean" });
    }

    note.favorite = favorite;
    await note.save();
    logger.info(`User ${req.user.id} set favorite=${favorite} for note titled "${note.title}"`);
    
    res.status(200).json({ id: note._id, favorite: note.favorite });
  } catch (error) {
    logger.error(`Failed to toggle favorite for note ${req.params.id} for user ${req.user.id}`, error);
    res.status(400).json({ message: "Failed to toggle favorite", error });
  }
});

module.exports = router;
