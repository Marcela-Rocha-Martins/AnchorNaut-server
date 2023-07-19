const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog.model');

// GET /api/dailylogs - Retrieves all daily logs
router.get('/dailylogs', (req, res, next) => {
  DailyLog.find()
    .populate('user')
    .then((allDailyLogs) => res.json(allDailyLogs))
    .catch((error) => res.json(error));
});

// GET /api/dailylogs/:logId - Retrieves a specific daily log by ID
router.get('/dailylogs/:logId', (req, res, next) => {
  const { logId } = req.params;

  DailyLog.findById(logId)
    .populate('user')
    .then((dailyLog) => {
      if (!dailyLog) {
        res.status(404).json({ message: 'Daily log not found' });
        return;
      }

      res.status(200).json(dailyLog);
    })
    .catch((error) => res.json(error));
});

// POST /api/dailylogs - Creates a new daily log
router.post('/dailylogs', (req, res, next) => {
  const { user, date, title, entry, photo, audio, mood, tags } = req.body;

  DailyLog.create({ user, date, title, entry, photo, audio, mood, tags })
    .then((newDailyLog) => res.status(201).json(newDailyLog))
    .catch((error) => res.json(error));
});

// DELETE /api/dailylogs/:logId - Deletes a specific daily log by ID
router.delete('/dailylogs/:logId', (req, res, next) => {
  const { logId } = req.params;

  DailyLog.findByIdAndDelete(logId)
    .then(() => res.json({ message: 'Daily log deleted successfully' }))
    .catch((error) => res.json(error));
});

module.exports = router;
