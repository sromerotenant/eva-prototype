/**
 * Property Data Configuration
 * 
 * Mock data for property selection in Change Request Widget
 */

export interface Property {
  id: string;
  name: string;
  code: string;
}

export interface UserIdentity {
  name: string;
  role: string;
  properties: Property[];
}

// Test Scenario Toggle
// Set to 'A' for single property, 'B' for multiple properties
export const TEST_SCENARIO: 'A' | 'B' = 'B';

// Scenario A: Single Property
const SCENARIO_A_PROPERTIES: Property[] = [
  { id: 'prop-1', name: 'Emerald Bay', code: 'EMB-001' }
];

// Scenario B: Multiple Properties
const SCENARIO_B_PROPERTIES: Property[] = [
  { id: 'prop-1', name: 'Sunny Peaks', code: 'SPK-001' },
  { id: 'prop-2', name: 'Ocean View', code: 'OCV-002' },
  { id: 'prop-3', name: 'Pine Ridge', code: 'PRG-003' },
  { id: 'prop-4', name: 'Mountain Vista', code: 'MTV-004' },
  { id: 'prop-5', name: 'Riverside Manor', code: 'RSM-005' },
  { id: 'prop-6', name: 'Forest Glen', code: 'FGL-006' },
  { id: 'prop-7', name: 'Lakeside Terrace', code: 'LST-007' },
  { id: 'prop-8', name: 'Valley Heights', code: 'VHT-008' },
  { id: 'prop-9', name: 'Coastal Breeze', code: 'CBR-009' },
  { id: 'prop-10', name: 'Hilltop Gardens', code: 'HTG-010' },
  { id: 'prop-11', name: 'Meadowbrook Estates', code: 'MBE-011' },
  { id: 'prop-12', name: 'Sunset Boulevard', code: 'SNB-012' },
  { id: 'prop-13', name: 'Greenwood Commons', code: 'GWC-013' },
  { id: 'prop-14', name: 'Parkview Apartments', code: 'PVA-014' },
  { id: 'prop-15', name: 'Crystal Springs', code: 'CSP-015' },
  { id: 'prop-16', name: 'Maplewood Village', code: 'MPV-016' },
  { id: 'prop-17', name: 'Willow Creek', code: 'WLC-017' },
  { id: 'prop-18', name: 'Harbor Point', code: 'HBP-018' },
  { id: 'prop-19', name: 'Crestview Heights', code: 'CVH-019' },
  { id: 'prop-20', name: 'Bayside Residences', code: 'BSR-020' },
  { id: 'prop-21', name: 'Highland Park', code: 'HLP-021' },
  { id: 'prop-22', name: 'Riverside Plaza', code: 'RSP-022' },
  { id: 'prop-23', name: 'Oakwood Terrace', code: 'OWT-023' }
];

// Get properties based on scenario
const getProperties = (): Property[] => {
  if (TEST_SCENARIO === 'A') {
    return SCENARIO_A_PROPERTIES;
  }
  return SCENARIO_B_PROPERTIES;
};

// Mock User Identity
export const MOCK_USER: UserIdentity = {
  name: 'John Doe',
  role: 'PM',
  properties: getProperties()
};

/**
 * Search properties by name or code
 * Returns matches for validation and disambiguation
 */
export const searchProperties = (query: string): Property[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Exact match by code
  const exactCodeMatch = MOCK_USER.properties.find(
    p => p.code.toLowerCase() === lowerQuery
  );
  if (exactCodeMatch) {
    return [exactCodeMatch];
  }
  
  // Partial matches by name or code
  const matches = MOCK_USER.properties.filter(
    p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.code.toLowerCase().includes(lowerQuery)
  );
  
  return matches;
};

/**
 * Validate if a property exists in user's portfolio
 */
export const validateProperty = (query: string): {
  isValid: boolean;
  matches: Property[];
  requiresCode: boolean;
} => {
  const matches = searchProperties(query);
  
  if (matches.length === 0) {
    return { isValid: false, matches: [], requiresCode: false };
  }
  
  if (matches.length === 1) {
    return { isValid: true, matches, requiresCode: false };
  }
  
  // Multiple matches - requires property code
  return { isValid: false, matches, requiresCode: true };
};

