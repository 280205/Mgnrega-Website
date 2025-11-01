import { Router, Request, Response } from 'express';

const router = Router();

// Detect district from browser geolocation
router.post('/detect', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // In production, use reverse geocoding service
    // For now, redirect to district lookup
    res.json({
      success: true,
      message: 'Use /api/districts/locate/coordinates endpoint',
      latitude,
      longitude
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to detect location'
    });
  }
});

export default router;
