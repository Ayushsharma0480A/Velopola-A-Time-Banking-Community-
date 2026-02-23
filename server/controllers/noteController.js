const Note = require('../models/Note');

// @desc    Get notes (READ)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

// @desc    Set note (CREATE)
// @route   POST /api/notes
const setNote = async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Please add a text field' });
  }
  const note = await Note.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(201).json(note);
};

// @desc    Update note (UPDATE)
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (note.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedNote);
};

// @desc    Delete note (DELETE)
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (note.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  await note.deleteOne();
  res.status(200).json({ id: req.params.id });
};

module.exports = { getNotes, setNote, updateNote, deleteNote };