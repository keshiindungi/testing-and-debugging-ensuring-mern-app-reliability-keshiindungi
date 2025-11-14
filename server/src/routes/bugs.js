import express from 'express';
import Bug from '../models/Bug.js';
import { validateBug } from '../utils/validation.js';

const router = express.Router();

// GET /api/bugs - Get all bugs with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Convert to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    const bugs = await Bug.find(filter)
      .sort({ createdAt: -1, _id: -1 }) // Secondary sort by _id
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    
    const total = await Bug.countDocuments(filter);
    
    res.json({
      bugs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum, // Return as number
      total
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bugs/:id - Get single bug
router.get('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json(bug);
  } catch (error) {
    next(error);
  }
});

// POST /api/bugs - Create new bug
router.post('/', async (req, res, next) => {
  try {
    const { error } = validateBug(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const bug = new Bug(req.body);
    await bug.save();
    
    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
});

// PUT /api/bugs/:id - Update bug
router.put('/:id', async (req, res, next) => {
  try {
    const { error } = validateBug(req.body, true);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/bugs/:id - Delete bug
router.delete('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;