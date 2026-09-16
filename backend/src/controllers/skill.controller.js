const Skill = require('../models/Skill');

const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.params.userId }).sort({ proficiency: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    
    if (!name || proficiency === undefined) {
      return res.status(400).json({ message: 'Name and proficiency are required' });
    }

    const skill = await Skill.create({
      user: req.user.id,
      name,
      category: category || 'General',
      proficiency
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserSkills, addSkill, updateSkill, deleteSkill };
