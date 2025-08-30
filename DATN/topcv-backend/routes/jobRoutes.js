// topcv-backend/routes/jobRoutes.js
const express = require('express');
const JobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', JobController.getAllJobs);

router.use(authMiddleware);

router.get('/my', JobController.getMyJobs); // ĐƯA ROUTE NÀY LÊN TRƯỚC ROUTE CÓ PARAMS ID

router.get('/:id', JobController.getJobById);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

module.exports = router;