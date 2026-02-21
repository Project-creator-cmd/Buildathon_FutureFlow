const express = require('express');
const router = express.Router();
const { 
  getAllCareers, 
  getCareerById, 
  generatePersonalizedRoadmap,
  getHighDemandCareers,
  getPersonalizedCareerById
} = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

router.get('/', getAllCareers);
router.get('/high-demand', protect, getHighDemandCareers);
router.get('/:id', getCareerById);
router.get('/:id/personalized', protect, getPersonalizedCareerById);
router.post('/personalized', protect, generatePersonalizedRoadmap);

module.exports = router;
