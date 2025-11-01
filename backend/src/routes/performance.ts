import { Router, Request, Response } from 'express';
import pool from '../config/database';
import redisClient from '../config/redis';
import { logger } from '../utils/logger';

const router = Router();

// Get current month performance for a district
router.get('/current/:districtCode', async (req: Request, res: Response) => {
  try {
    const { districtCode } = req.params;
    const cacheKey = `performance:current:${districtCode}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Query database for current month
    const result = await pool.query(`
      SELECT p.*, d.name as district_name, d.state_code
      FROM performance p
      JOIN districts d ON p.district_code = d.code
      WHERE p.district_code = $1
      ORDER BY p.year DESC, p.month DESC
      LIMIT 1
    `, [districtCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No performance data found for this district'
      });
    }

    // Cache for 6 hours
    await redisClient.setEx(cacheKey, 21600, JSON.stringify(result.rows[0]));

    res.json({
      success: true,
      data: result.rows[0],
      source: 'database'
    });
  } catch (error) {
    logger.error('Error fetching current performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance data'
    });
  }
});

// Get historical performance for a district
router.get('/history/:districtCode', async (req: Request, res: Response) => {
  try {
    const { districtCode } = req.params;
    const { months = '12' } = req.query;
    const cacheKey = `performance:history:${districtCode}:${months}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Query database for historical data
    const result = await pool.query(`
      SELECT p.*, d.name as district_name, d.state_code
      FROM performance p
      JOIN districts d ON p.district_code = d.code
      WHERE p.district_code = $1
      ORDER BY p.year DESC, p.month DESC
      LIMIT $2
    `, [districtCode, parseInt(months as string)]);

    // Cache for 12 hours
    await redisClient.setEx(cacheKey, 43200, JSON.stringify(result.rows));

    res.json({
      success: true,
      data: result.rows,
      source: 'database'
    });
  } catch (error) {
    logger.error('Error fetching historical performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data'
    });
  }
});

// Get comparative data (state average vs district)
router.get('/compare/:districtCode', async (req: Request, res: Response) => {
  try {
    const { districtCode } = req.params;
    const cacheKey = `performance:compare:${districtCode}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Get district data
    const districtResult = await pool.query(`
      SELECT p.*, d.state_code
      FROM performance p
      JOIN districts d ON p.district_code = d.code
      WHERE p.district_code = $1
      ORDER BY p.year DESC, p.month DESC
      LIMIT 1
    `, [districtCode]);

    if (districtResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No performance data found'
      });
    }

    const districtData = districtResult.rows[0];

    // Get state average for same period
    const stateResult = await pool.query(`
      SELECT 
        AVG(person_days_generated) as avg_person_days,
        AVG(employment_provided) as avg_employment,
        AVG(active_job_cards) as avg_job_cards,
        AVG(average_wage) as avg_wage
      FROM performance p
      JOIN districts d ON p.district_code = d.code
      WHERE d.state_code = $1
        AND p.year = $2
        AND p.month = $3
    `, [districtData.state_code, districtData.year, districtData.month]);

    const compareData = {
      district: districtData,
      stateAverage: stateResult.rows[0]
    };

    // Cache for 12 hours
    await redisClient.setEx(cacheKey, 43200, JSON.stringify(compareData));

    res.json({
      success: true,
      data: compareData,
      source: 'database'
    });
  } catch (error) {
    logger.error('Error fetching comparative data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comparative data'
    });
  }
});

export default router;
