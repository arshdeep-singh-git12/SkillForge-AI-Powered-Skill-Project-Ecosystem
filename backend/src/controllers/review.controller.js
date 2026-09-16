const Review = require('../models/Review');

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('reviewer', 'name avatar')
      .populate('project', 'title githubUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { projectId, rating, title, content, skillEndorsements } = req.body;
    
    if (!projectId || !rating || !title || !content) {
      return res.status(400).json({ message: 'Project, rating, title, and content are required' });
    }

    const review = await Review.create({
      reviewer: req.user.id,
      project: projectId,
      rating,
      title,
      content,
      skillEndorsements: skillEndorsements || []
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('project', 'title githubUrl');
      
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllReviews, createReview };
