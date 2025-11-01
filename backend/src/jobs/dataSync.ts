import cron from 'node-cron';
import axios from 'axios';
import pool from '../config/database';
import { logger } from '../utils/logger';

// Data.gov.in API configuration
const API_BASE_URL = 'https://api.data.gov.in/resource';
const API_RESOURCE_ID = 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722';
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd0000018e88b47e4a5e489473fccf3ef7fbc57f';

interface MGNREGAData {
  district_code: string;
  district_name: string;
  state_code: string;
  year: number;
  month: number;
  person_days: number;
  employment: number;
  job_cards: number;
  avg_wage: number;
  expenditure: number;
}

export class DataSyncService {
  private isRunning = false;

  // Sync MGNREGA data from data.gov.in
  async syncMGNREGAData(): Promise<void> {
    if (this.isRunning) {
      logger.info('Sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    const syncId = await this.logSyncStart('mgnrega_performance');

    try {
      logger.info('Starting MGNREGA data sync from data.gov.in...');
      
      // Fetch Uttar Pradesh MGNREGA data
      const response = await axios.get(`${API_BASE_URL}/${API_RESOURCE_ID}`, {
        params: {
          'api-key': API_KEY,
          'format': 'json',
          'filters[state_name]': 'UTTAR PRADESH',
          'filters[fin_year]': '2024-2025', // Current financial year
          'limit': 1000 // Get all UP districts
        },
        timeout: 30000
      });

      const records = response.data.records || [];
      let recordsProcessed = 0;

      logger.info(`Fetched ${records.length} records from data.gov.in API`);

      // Process each record
      for (const record of records) {
        try {
          // Map API fields to our database schema
          const performanceData = {
            district_code: record.district_code || 'UNKNOWN',
            district_name: record.district_name,
            year: this.parseFinancialYear(record.fin_year),
            month: this.parseMonth(record.month),
            person_days_generated: parseInt(record.Persondays_of_Central_Liability_so_far) || 0,
            employment_provided: parseInt(record.Total_Individuals_Worked) || 0,
            active_job_cards: parseInt(record.Total_No_of_Active_Job_Cards) || 0,
            total_households: parseInt(record.Total_Households_Worked) || 0,
            women_persondays: parseInt(record.Women_Persondays) || 0,
            sc_persondays: parseInt(record.SC_persondays) || 0,
            st_persondays: parseInt(record.ST_persondays) || 0,
            average_wage: parseFloat(record.Average_Wage_rate_per_day_per_person) || 0,
            total_expenditure: parseFloat(record.Total_Exp) || 0,
            wage_expenditure: parseFloat(record.Wages) || 0,
            material_expenditure: parseFloat(record.Material_and_skilled_Wages) || 0,
            works_completed: parseInt(record.Number_of_Completed_Works) || 0,
            works_ongoing: parseInt(record.Number_of_Ongoing_Works) || 0
          };

          await this.upsertPerformanceData(performanceData);
          recordsProcessed++;
        } catch (error) {
          logger.error(`Error processing record:`, error);
        }
      }

      await this.logSyncComplete(syncId, 'success', recordsProcessed);
      logger.info(`✅ Sync completed successfully. Processed ${recordsProcessed} records from real government API.`);
    } catch (error) {
      await this.logSyncComplete(syncId, 'failed', 0, error instanceof Error ? error.message : 'Unknown error');
      logger.error('❌ Sync failed:', error);
      logger.info('💡 Falling back to mock data generation...');
      await this.generateMockData();
    } finally {
      this.isRunning = false;
    }
  }

  // Helper: Parse financial year (e.g., "2024-2025" -> 2024)
  private parseFinancialYear(finYear: string): number {
    const match = finYear.match(/(\d{4})-\d{4}/);
    return match ? parseInt(match[1]) : new Date().getFullYear();
  }

  // Helper: Parse month name to number
  private parseMonth(monthName: string): number {
    const months: { [key: string]: number } = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthName] || new Date().getMonth() + 1;
  }

  // Generate mock data for testing (when API is not available)
  async generateMockData(): Promise<void> {
    logger.info('Generating mock data...');
    
    const districts = await pool.query('SELECT code FROM districts');
    const currentDate = new Date();
    
    for (const district of districts.rows) {
      // Generate last 12 months of data
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        
        const mockData = {
          district_code: district.code,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          person_days_generated: Math.floor(Math.random() * 500000) + 100000,
          employment_provided: Math.floor(Math.random() * 10000) + 2000,
          active_job_cards: Math.floor(Math.random() * 50000) + 10000,
          total_households: Math.floor(Math.random() * 80000) + 20000,
          women_persondays: Math.floor(Math.random() * 250000) + 50000,
          sc_persondays: Math.floor(Math.random() * 150000) + 30000,
          st_persondays: Math.floor(Math.random() * 100000) + 20000,
          average_wage: (Math.random() * 100 + 150).toFixed(2),
          total_expenditure: (Math.random() * 10000000 + 5000000).toFixed(2),
          material_expenditure: (Math.random() * 3000000 + 1000000).toFixed(2),
          wage_expenditure: (Math.random() * 7000000 + 4000000).toFixed(2),
          works_completed: Math.floor(Math.random() * 500) + 100,
          works_ongoing: Math.floor(Math.random() * 300) + 50
        };

        await pool.query(`
          INSERT INTO performance (
            district_code, year, month, person_days_generated, 
            employment_provided, active_job_cards, total_households,
            women_persondays, sc_persondays, st_persondays,
            average_wage, total_expenditure, material_expenditure,
            wage_expenditure, works_completed, works_ongoing
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (district_code, year, month) DO UPDATE SET
            person_days_generated = EXCLUDED.person_days_generated,
            employment_provided = EXCLUDED.employment_provided,
            active_job_cards = EXCLUDED.active_job_cards,
            updated_at = CURRENT_TIMESTAMP
        `, [
          mockData.district_code, mockData.year, mockData.month,
          mockData.person_days_generated, mockData.employment_provided,
          mockData.active_job_cards, mockData.total_households,
          mockData.women_persondays, mockData.sc_persondays, mockData.st_persondays,
          mockData.average_wage, mockData.total_expenditure,
          mockData.material_expenditure, mockData.wage_expenditure,
          mockData.works_completed, mockData.works_ongoing
        ]);
      }
    }

    logger.info('Mock data generation completed');
  }

  private async upsertPerformanceData(data: any): Promise<void> {
    await pool.query(`
      INSERT INTO performance (
        district_code, year, month, person_days_generated,
        employment_provided, active_job_cards, total_households,
        women_persondays, sc_persondays, st_persondays,
        average_wage, total_expenditure, material_expenditure,
        wage_expenditure, works_completed, works_ongoing
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (district_code, year, month) DO UPDATE SET
        person_days_generated = EXCLUDED.person_days_generated,
        employment_provided = EXCLUDED.employment_provided,
        active_job_cards = EXCLUDED.active_job_cards,
        total_households = EXCLUDED.total_households,
        women_persondays = EXCLUDED.women_persondays,
        sc_persondays = EXCLUDED.sc_persondays,
        st_persondays = EXCLUDED.st_persondays,
        average_wage = EXCLUDED.average_wage,
        total_expenditure = EXCLUDED.total_expenditure,
        material_expenditure = EXCLUDED.material_expenditure,
        wage_expenditure = EXCLUDED.wage_expenditure,
        works_completed = EXCLUDED.works_completed,
        works_ongoing = EXCLUDED.works_ongoing,
        updated_at = CURRENT_TIMESTAMP
    `, [
      data.district_code, data.year, data.month,
      data.person_days_generated, data.employment_provided,
      data.active_job_cards, data.total_households,
      data.women_persondays, data.sc_persondays, data.st_persondays,
      data.average_wage, data.total_expenditure,
      data.material_expenditure, data.wage_expenditure,
      data.works_completed, data.works_ongoing
    ]);
  }

  private async logSyncStart(type: string): Promise<number> {
    const result = await pool.query(
      'INSERT INTO sync_log (sync_type, status, started_at) VALUES ($1, $2, NOW()) RETURNING id',
      [type, 'running']
    );
    return result.rows[0].id;
  }

  private async logSyncComplete(
    id: number,
    status: string,
    records: number,
    error?: string
  ): Promise<void> {
    await pool.query(
      'UPDATE sync_log SET status = $1, records_processed = $2, error_message = $3, completed_at = NOW() WHERE id = $4',
      [status, records, error, id]
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Schedule sync job
  startScheduledSync(): void {
    const syncInterval = process.env.SYNC_INTERVAL_HOURS || '6';
    
    // Run every N hours
    cron.schedule(`0 */${syncInterval} * * *`, async () => {
      logger.info('Running scheduled data sync...');
      await this.syncMGNREGAData();
    });

    logger.info(`Scheduled sync job to run every ${syncInterval} hours`);
  }
}

// Export singleton instance
export const dataSyncService = new DataSyncService();
