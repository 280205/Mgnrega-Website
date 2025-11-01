import { Router, Request, Response } from 'express';
import pool from '../config/database';
import redisClient from '../config/redis';
import { logger } from '../utils/logger';

const router = Router();

// Get all districts for a state
router.get('/:stateCode', async (req: Request, res: Response) => {
  try {
    const { stateCode } = req.params;
    const cacheKey = `districts:${stateCode}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Query database
    const result = await pool.query(
      'SELECT * FROM districts WHERE state_code = $1 ORDER BY name',
      [stateCode]
    );

    // Cache for 24 hours
    await redisClient.setEx(cacheKey, 86400, JSON.stringify(result.rows));

    res.json({
      success: true,
      data: result.rows,
      source: 'database'
    });
  } catch (error) {
    logger.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch districts'
    });
  }
});

// Get district by coordinates (for geolocation)
router.get('/locate/coordinates', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Find nearest district using PostGIS or simple calculation
    // For simplicity, using basic distance calculation
    const result = await pool.query(`
      SELECT *, 
        (
          3959 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance
      FROM districts
      ORDER BY distance
      LIMIT 1
    `, [parseFloat(lat as string), parseFloat(lng as string)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No district found for these coordinates'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error locating district:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to locate district'
    });
  }
});

export default router;
