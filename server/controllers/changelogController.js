const Changelog = require('../models/Changelog');

// Get all published changelog entries
const getPublishedChangelogs = async (req, res) => {
  try {
    const changelogs = await Changelog.find({ published: true }).sort({ date: -1 });
    res.status(200).json(changelogs);
  } catch (error) {
    console.error('Error fetching changelogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all changelog entries (including unpublished) - admin only
const getAllChangelogs = async (req, res) => {
  try {
    const changelogs = await Changelog.find({}).sort({ date: -1 });
    res.status(200).json(changelogs);
  } catch (error) {
    console.error('Error fetching all changelogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single changelog entry
const getChangelogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const changelog = await Changelog.findById(id);
    if (!changelog) {
      return res.status(404).json({ message: 'Changelog entry not found' });
    }
    
    // If changelog is not published and user is not admin, deny access
    if (!changelog.published && (!req.user || !req.user.isAdmin)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(changelog);
  } catch (error) {
    console.error('Error fetching changelog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new changelog entry
const createChangelog = async (req, res) => {
  try {
    const { version, date, changes, published } = req.body;
    
    const newChangelog = new Changelog({
      version,
      date: date || Date.now(),
      changes,
      published,
    });
    
    const savedChangelog = await newChangelog.save();
    res.status(201).json(savedChangelog);
  } catch (error) {
    console.error('Error creating changelog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update changelog entry
const updateChangelog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const changelog = await Changelog.findById(id);
    if (!changelog) {
      return res.status(404).json({ message: 'Changelog entry not found' });
    }
    
    const updatedChangelog = await Changelog.findByIdAndUpdate(
      id, 
      updates, 
      { new: true }
    );
    
    res.status(200).json(updatedChangelog);
  } catch (error) {
    console.error('Error updating changelog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete changelog entry
const deleteChangelog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const changelog = await Changelog.findById(id);
    if (!changelog) {
      return res.status(404).json({ message: 'Changelog entry not found' });
    }
    
    await Changelog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Changelog entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting changelog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPublishedChangelogs,
  getAllChangelogs,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
};
