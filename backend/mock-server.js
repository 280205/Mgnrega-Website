// Mock API Server for Development
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Get districts
app.get('/api/districts/:stateCode', (req, res) => {
  const { stateCode } = req.params;
  
  const allDistricts = [
    // Uttar Pradesh
    { code: 'UP001', name: 'Agra', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081 },
    { code: 'UP002', name: 'Lucknow', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
    { code: 'UP003', name: 'Varanasi', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739 },
    { code: 'UP004', name: 'Kanpur Nagar', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319 },
    { code: 'UP005', name: 'Allahabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463 },
    { code: 'UP006', name: 'Meerut', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.9845, longitude: 77.7064 },
    { code: 'UP007', name: 'Ghaziabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.6692, longitude: 77.4538 },
    { code: 'UP008', name: 'Bareilly', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.3670, longitude: 79.4304 },
    { code: 'UP009', name: 'Moradabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.8389, longitude: 78.7768 },
    { code: 'UP010', name: 'Aligarh', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880 },
    
    // Maharashtra
    { code: 'MH001', name: 'Mumbai', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    { code: 'MH002', name: 'Pune', state_code: 'MH', state_name: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
    { code: 'MH003', name: 'Nagpur', state_code: 'MH', state_name: 'Maharashtra', latitude: 21.1458, longitude: 79.0882 },
    { code: 'MH004', name: 'Nashik', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.9975, longitude: 73.7898 },
    { code: 'MH005', name: 'Aurangabad', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.8762, longitude: 75.3433 },
    
    // Madhya Pradesh
    { code: 'MP001', name: 'Bhopal', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
    { code: 'MP002', name: 'Indore', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
    { code: 'MP003', name: 'Gwalior', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828 },
    { code: 'MP004', name: 'Jabalpur', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 23.1815, longitude: 79.9864 },
    
    // Bihar
    { code: 'BR001', name: 'Patna', state_code: 'BR', state_name: 'Bihar', latitude: 25.5941, longitude: 85.1376 },
    { code: 'BR002', name: 'Gaya', state_code: 'BR', state_name: 'Bihar', latitude: 24.7955, longitude: 85.0002 },
    { code: 'BR003', name: 'Muzaffarpur', state_code: 'BR', state_name: 'Bihar', latitude: 26.1225, longitude: 85.3906 },
    { code: 'BR004', name: 'Bhagalpur', state_code: 'BR', state_name: 'Bihar', latitude: 25.2425, longitude: 86.9842 },
    
    // West Bengal
    { code: 'WB001', name: 'Kolkata', state_code: 'WB', state_name: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    { code: 'WB002', name: 'Howrah', state_code: 'WB', state_name: 'West Bengal', latitude: 22.5958, longitude: 88.2636 },
    { code: 'WB003', name: 'Darjeeling', state_code: 'WB', state_name: 'West Bengal', latitude: 27.0360, longitude: 88.2627 },
    
    // Rajasthan
    { code: 'RJ001', name: 'Jaipur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    { code: 'RJ002', name: 'Jodhpur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 26.2389, longitude: 73.0243 },
    { code: 'RJ003', name: 'Udaipur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 24.5854, longitude: 73.7125 },
    { code: 'RJ004', name: 'Kota', state_code: 'RJ', state_name: 'Rajasthan', latitude: 25.2138, longitude: 75.8648 },
    
    // Gujarat
    { code: 'GJ001', name: 'Ahmedabad', state_code: 'GJ', state_name: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    { code: 'GJ002', name: 'Surat', state_code: 'GJ', state_name: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
    { code: 'GJ003', name: 'Vadodara', state_code: 'GJ', state_name: 'Gujarat', latitude: 22.3072, longitude: 73.1812 },
    
    // Tamil Nadu
    { code: 'TN001', name: 'Chennai', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    { code: 'TN002', name: 'Coimbatore', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558 },
    { code: 'TN003', name: 'Madurai', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198 },
    
    // Karnataka
    { code: 'KA001', name: 'Bangalore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    { code: 'KA002', name: 'Mysore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.2958, longitude: 76.6394 },
    { code: 'KA003', name: 'Mangalore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.9141, longitude: 74.8560 },
    
    // Kerala
    { code: 'KL001', name: 'Thiruvananthapuram', state_code: 'KL', state_name: 'Kerala', latitude: 8.5241, longitude: 76.9366 },
    { code: 'KL002', name: 'Kochi', state_code: 'KL', state_name: 'Kerala', latitude: 9.9312, longitude: 76.2673 },
    { code: 'KL003', name: 'Kozhikode', state_code: 'KL', state_name: 'Kerala', latitude: 11.2588, longitude: 75.7804 },
    
    // Telangana
    { code: 'TG001', name: 'Hyderabad', state_code: 'TG', state_name: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
    { code: 'TG002', name: 'Warangal', state_code: 'TG', state_name: 'Telangana', latitude: 17.9784, longitude: 79.6005 },
    
    // Andhra Pradesh
    { code: 'AP001', name: 'Visakhapatnam', state_code: 'AP', state_name: 'Andhra Pradesh', latitude: 17.6869, longitude: 83.2185 },
    { code: 'AP002', name: 'Vijayawada', state_code: 'AP', state_name: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480 },
    
    // Punjab
    { code: 'PB001', name: 'Amritsar', state_code: 'PB', state_name: 'Punjab', latitude: 31.6340, longitude: 74.8723 },
    { code: 'PB002', name: 'Ludhiana', state_code: 'PB', state_name: 'Punjab', latitude: 30.9010, longitude: 75.8573 },
    
    // Haryana
    { code: 'HR001', name: 'Gurugram', state_code: 'HR', state_name: 'Haryana', latitude: 28.4595, longitude: 77.0266 },
    { code: 'HR002', name: 'Faridabad', state_code: 'HR', state_name: 'Haryana', latitude: 28.4089, longitude: 77.3178 },
    
    // Odisha
    { code: 'OD001', name: 'Bhubaneswar', state_code: 'OD', state_name: 'Odisha', latitude: 20.2961, longitude: 85.8245 },
    { code: 'OD002', name: 'Cuttack', state_code: 'OD', state_name: 'Odisha', latitude: 20.4625, longitude: 85.8830 }
  ];
  
  // Filter districts by state code
  const districts = stateCode === 'ALL' 
    ? allDistricts 
    : allDistricts.filter(d => d.state_code === stateCode);
  
  res.json({ success: true, data: districts, source: 'mock' });
});

// Locate district by coordinates
app.get('/api/districts/locate/coordinates', (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);
  
  // Get all districts
  const allDistricts = [
    // Uttar Pradesh
    { code: 'UP001', name: 'Agra', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081 },
    { code: 'UP002', name: 'Lucknow', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
    { code: 'UP003', name: 'Varanasi', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739 },
    { code: 'UP004', name: 'Kanpur Nagar', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319 },
    { code: 'UP005', name: 'Allahabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463 },
    { code: 'UP006', name: 'Meerut', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.9845, longitude: 77.7064 },
    { code: 'UP007', name: 'Ghaziabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.6692, longitude: 77.4538 },
    { code: 'UP008', name: 'Bareilly', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.3670, longitude: 79.4304 },
    { code: 'UP009', name: 'Moradabad', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 28.8389, longitude: 78.7768 },
    { code: 'UP010', name: 'Aligarh', state_code: 'UP', state_name: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880 },
    // Maharashtra
    { code: 'MH001', name: 'Mumbai', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    { code: 'MH002', name: 'Pune', state_code: 'MH', state_name: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
    { code: 'MH003', name: 'Nagpur', state_code: 'MH', state_name: 'Maharashtra', latitude: 21.1458, longitude: 79.0882 },
    { code: 'MH004', name: 'Nashik', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.9975, longitude: 73.7898 },
    { code: 'MH005', name: 'Aurangabad', state_code: 'MH', state_name: 'Maharashtra', latitude: 19.8762, longitude: 75.3433 },
    // Madhya Pradesh
    { code: 'MP001', name: 'Bhopal', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
    { code: 'MP002', name: 'Indore', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
    { code: 'MP003', name: 'Gwalior', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828 },
    { code: 'MP004', name: 'Jabalpur', state_code: 'MP', state_name: 'Madhya Pradesh', latitude: 23.1815, longitude: 79.9864 },
    // Bihar
    { code: 'BR001', name: 'Patna', state_code: 'BR', state_name: 'Bihar', latitude: 25.5941, longitude: 85.1376 },
    { code: 'BR002', name: 'Gaya', state_code: 'BR', state_name: 'Bihar', latitude: 24.7955, longitude: 85.0002 },
    { code: 'BR003', name: 'Muzaffarpur', state_code: 'BR', state_name: 'Bihar', latitude: 26.1225, longitude: 85.3906 },
    { code: 'BR004', name: 'Bhagalpur', state_code: 'BR', state_name: 'Bihar', latitude: 25.2425, longitude: 86.9842 },
    // West Bengal
    { code: 'WB001', name: 'Kolkata', state_code: 'WB', state_name: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    { code: 'WB002', name: 'Howrah', state_code: 'WB', state_name: 'West Bengal', latitude: 22.5958, longitude: 88.2636 },
    { code: 'WB003', name: 'Darjeeling', state_code: 'WB', state_name: 'West Bengal', latitude: 27.0360, longitude: 88.2627 },
    // Rajasthan
    { code: 'RJ001', name: 'Jaipur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    { code: 'RJ002', name: 'Jodhpur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 26.2389, longitude: 73.0243 },
    { code: 'RJ003', name: 'Udaipur', state_code: 'RJ', state_name: 'Rajasthan', latitude: 24.5854, longitude: 73.7125 },
    { code: 'RJ004', name: 'Kota', state_code: 'RJ', state_name: 'Rajasthan', latitude: 25.2138, longitude: 75.8648 },
    // Gujarat
    { code: 'GJ001', name: 'Ahmedabad', state_code: 'GJ', state_name: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    { code: 'GJ002', name: 'Surat', state_code: 'GJ', state_name: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
    { code: 'GJ003', name: 'Vadodara', state_code: 'GJ', state_name: 'Gujarat', latitude: 22.3072, longitude: 73.1812 },
    // Tamil Nadu
    { code: 'TN001', name: 'Chennai', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    { code: 'TN002', name: 'Coimbatore', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558 },
    { code: 'TN003', name: 'Madurai', state_code: 'TN', state_name: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198 },
    // Karnataka
    { code: 'KA001', name: 'Bangalore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    { code: 'KA002', name: 'Mysore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.2958, longitude: 76.6394 },
    { code: 'KA003', name: 'Mangalore', state_code: 'KA', state_name: 'Karnataka', latitude: 12.9141, longitude: 74.8560 },
    // Kerala
    { code: 'KL001', name: 'Thiruvananthapuram', state_code: 'KL', state_name: 'Kerala', latitude: 8.5241, longitude: 76.9366 },
    { code: 'KL002', name: 'Kochi', state_code: 'KL', state_name: 'Kerala', latitude: 9.9312, longitude: 76.2673 },
    { code: 'KL003', name: 'Kozhikode', state_code: 'KL', state_name: 'Kerala', latitude: 11.2588, longitude: 75.7804 },
    // Telangana
    { code: 'TG001', name: 'Hyderabad', state_code: 'TG', state_name: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
    { code: 'TG002', name: 'Warangal', state_code: 'TG', state_name: 'Telangana', latitude: 17.9784, longitude: 79.6005 },
    // Andhra Pradesh
    { code: 'AP001', name: 'Visakhapatnam', state_code: 'AP', state_name: 'Andhra Pradesh', latitude: 17.6869, longitude: 83.2185 },
    { code: 'AP002', name: 'Vijayawada', state_code: 'AP', state_name: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480 },
    // Punjab
    { code: 'PB001', name: 'Amritsar', state_code: 'PB', state_name: 'Punjab', latitude: 31.6340, longitude: 74.8723 },
    { code: 'PB002', name: 'Ludhiana', state_code: 'PB', state_name: 'Punjab', latitude: 30.9010, longitude: 75.8573 },
    // Haryana
    { code: 'HR001', name: 'Gurugram', state_code: 'HR', state_name: 'Haryana', latitude: 28.4595, longitude: 77.0266 },
    { code: 'HR002', name: 'Faridabad', state_code: 'HR', state_name: 'Haryana', latitude: 28.4089, longitude: 77.3178 },
    // Odisha
    { code: 'OD001', name: 'Bhubaneswar', state_code: 'OD', state_name: 'Odisha', latitude: 20.2961, longitude: 85.8245 },
    { code: 'OD002', name: 'Cuttack', state_code: 'OD', state_name: 'Odisha', latitude: 20.4625, longitude: 85.8830 }
  ];
  
  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  // Find nearest district
  let nearestDistrict = allDistricts[0];
  let minDistance = calculateDistance(userLat, userLng, nearestDistrict.latitude, nearestDistrict.longitude);
  
  allDistricts.forEach(district => {
    const distance = calculateDistance(userLat, userLng, district.latitude, district.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestDistrict = district;
    }
  });
  
  res.json({
    success: true,
    data: nearestDistrict,
    distance: Math.round(minDistance) + ' km'
  });
});

// District name mapping (expanded for all states)
const districtNames = {
  // Uttar Pradesh
  'UP001': 'Agra', 'UP002': 'Lucknow', 'UP003': 'Varanasi', 'UP004': 'Kanpur Nagar',
  'UP005': 'Allahabad', 'UP006': 'Meerut', 'UP007': 'Ghaziabad', 'UP008': 'Bareilly',
  'UP009': 'Moradabad', 'UP010': 'Aligarh',
  // Maharashtra
  'MH001': 'Mumbai', 'MH002': 'Pune', 'MH003': 'Nagpur', 'MH004': 'Nashik', 'MH005': 'Aurangabad',
  // Madhya Pradesh
  'MP001': 'Bhopal', 'MP002': 'Indore', 'MP003': 'Gwalior', 'MP004': 'Jabalpur',
  // Bihar
  'BR001': 'Patna', 'BR002': 'Gaya', 'BR003': 'Muzaffarpur', 'BR004': 'Bhagalpur',
  // West Bengal
  'WB001': 'Kolkata', 'WB002': 'Howrah', 'WB003': 'Darjeeling',
  // Rajasthan
  'RJ001': 'Jaipur', 'RJ002': 'Jodhpur', 'RJ003': 'Udaipur', 'RJ004': 'Kota',
  // Gujarat
  'GJ001': 'Ahmedabad', 'GJ002': 'Surat', 'GJ003': 'Vadodara',
  // Tamil Nadu
  'TN001': 'Chennai', 'TN002': 'Coimbatore', 'TN003': 'Madurai',
  // Karnataka
  'KA001': 'Bangalore', 'KA002': 'Mysore', 'KA003': 'Mangalore',
  // Kerala
  'KL001': 'Thiruvananthapuram', 'KL002': 'Kochi', 'KL003': 'Kozhikode',
  // Telangana
  'TG001': 'Hyderabad', 'TG002': 'Warangal',
  // Andhra Pradesh
  'AP001': 'Visakhapatnam', 'AP002': 'Vijayawada',
  // Punjab
  'PB001': 'Amritsar', 'PB002': 'Ludhiana',
  // Haryana
  'HR001': 'Gurugram', 'HR002': 'Faridabad',
  // Odisha
  'OD001': 'Bhubaneswar', 'OD002': 'Cuttack'
};

// Generate district-specific data
const generateDistrictData = (districtCode) => {
  // Generate unique seed based on district code
  const stateCode = districtCode.substring(0, 2);
  const distNum = parseInt(districtCode.substring(2)) || 1;
  const seed = (stateCode.charCodeAt(0) + stateCode.charCodeAt(1)) * 10 + distNum;
  
  const districtName = districtNames[districtCode] || 'Unknown';
  
  return {
    district_code: districtCode,
    district_name: districtName,
    year: 2025,
    month: 10,
    person_days_generated: Math.floor(200000 + (seed * 15000) + Math.random() * 150000),
    employment_provided: Math.floor(4000 + (seed * 300) + Math.random() * 3000),
    active_job_cards: Math.floor(25000 + (seed * 1500) + Math.random() * 15000),
    average_wage: parseFloat((180 + (seed * 2) + Math.random() * 50).toFixed(2)),
    total_expenditure: Math.floor(60000000 + (seed * 5000000) + Math.random() * 30000000),
    works_completed: Math.floor(200 + (seed * 30) + Math.random() * 200),
    works_ongoing: Math.floor(50 + (seed * 10) + Math.random() * 80)
  };
};

// Current performance
app.get('/api/performance/current/:districtCode', (req, res) => {
  const data = generateDistrictData(req.params.districtCode);
  res.json({ success: true, data, source: 'mock' });
});

// Historical performance
app.get('/api/performance/history/:districtCode', (req, res) => {
  const months = parseInt(req.query.months || '12');
  const data = [];
  const districtCode = req.params.districtCode;
  const districtName = districtNames[districtCode] || 'Unknown';
  
  const stateCode = districtCode.substring(0, 2);
  const distNum = parseInt(districtCode.substring(2)) || 1;
  const seed = (stateCode.charCodeAt(0) + stateCode.charCodeAt(1)) * 10 + distNum;
  
  for (let i = 0; i < months; i++) {
    const month = 10 - i;
    const year = month <= 0 ? 2024 : 2025;
    const adjustedMonth = month <= 0 ? 12 + month : month;
    
    data.push({
      district_code: districtCode,
      district_name: districtName,
      year: year,
      month: adjustedMonth,
      person_days_generated: Math.floor(200000 + (seed * 12000) + Math.random() * 120000),
      employment_provided: Math.floor(4000 + (seed * 250) + Math.random() * 2500),
      active_job_cards: Math.floor(25000 + (seed * 1200) + Math.random() * 12000),
      average_wage: 180 + (seed * 1.5) + Math.random() * 40,
      total_expenditure: 60000000 + (seed * 4000000) + Math.random() * 25000000,
      works_completed: Math.floor(200 + (seed * 25) + Math.random() * 150),
      works_ongoing: Math.floor(50 + (seed * 8) + Math.random() * 60)
    });
  }
  
  res.json({ success: true, data, source: 'mock' });
});

// Comparison
app.get('/api/performance/compare/:districtCode', (req, res) => {
  const districtCode = req.params.districtCode;
  const districtData = generateDistrictData(districtCode);
  
  const data = {
    district: {
      district_code: districtCode,
      district_name: districtData.district_name,
      year: 2025,
      month: 10,
      person_days_generated: districtData.person_days_generated,
      employment_provided: districtData.employment_provided,
      active_job_cards: districtData.active_job_cards,
      average_wage: districtData.average_wage
    },
    stateAverage: {
      avg_person_days: 380000,
      avg_employment: 7200,
      avg_job_cards: 40000,
      avg_wage: 215.00
    }
  };
  
  res.json({ success: true, data, source: 'mock' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints available:`);
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/districts/UP`);
  console.log(`   - http://localhost:${PORT}/api/performance/current/UP001`);
  console.log(`\n✨ Ready to serve the frontend!\n`);
});
