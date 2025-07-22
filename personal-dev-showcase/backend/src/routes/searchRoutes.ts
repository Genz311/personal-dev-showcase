import express from 'express';
import {
  searchProjects,
  getTechnologies,
  getProjectStats,
} from '../controllers/searchController';

const router = express.Router();

// Search routes
router.get('/projects', searchProjects);
router.get('/technologies', getTechnologies);
router.get('/stats', getProjectStats);

export default router;