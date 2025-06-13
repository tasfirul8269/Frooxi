import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1 });
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (err) {
    console.error('Error fetching testimonial:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const {
      clientName,
      clientPosition,
      clientCompany,
      content,
      rating,
      imageUrl,
      order
    } = req.body;

    const testimonial = new Testimonial({
      clientName,
      clientPosition,
      clientCompany,
      content,
      rating,
      imageUrl,
      order
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const {
      clientName,
      clientPosition,
      clientCompany,
      content,
      rating,
      imageUrl,
      order,
      isActive
    } = req.body;

    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }

    testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        clientName,
        clientPosition,
        clientCompany,
        content,
        rating,
        imageUrl,
        order,
        isActive
      },
      { new: true }
    );

    res.json(testimonial);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ msg: 'Testimonial removed' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
}; 