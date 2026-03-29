// Official KNEC Subject Groupings Map

const SubjectGroups = {
  I: ['MAT', 'ENG', 'KIS'], // Mathematics, English, Kiswahili
  II: ['BIO', 'CHEM', 'PHY'], // Biology, Chemistry, Physics
  III: ['HIST', 'GEO', 'CRE', 'IRE', 'HRE'], // History, Geography, CRE, IRE, HRE
  IV: ['HSC', 'ART', 'AGRI', 'COMP', 'AVI'], // Home Science, Art & Design, Agriculture, Computer Studies, Aviation
  V: ['FRE', 'GER', 'ARB', 'MUS', 'BST'] // French, German, Arabic, Music, Business Studies 
};

// Simple point mapping
const gradePoints = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};

// Maps verbose string like 'Mathematics / Business Studies' to an array of internal codes: ['MAT', 'BST']
const parseSubjectString = (str) => {
  const mapping = {
    'mathematics': 'MAT',
    'english': 'ENG',
    'kiswahili': 'KIS',
    'biology': 'BIO',
    'chemistry': 'CHEM',
    'physics': 'PHY',
    'history': 'HIST',
    'geography': 'GEO',
    'cre': 'CRE',
    'agriculture': 'AGRI',
    'business studies': 'BST',
    'computer': 'COMP'
  };

  const parsedCodes = [];
  const options = str.split('/').map(s => s.trim().toLowerCase());
  
  for (const option of options) {
    if (mapping[option]) {
      parsedCodes.push(mapping[option]);
    } else if (option.includes('group ii') && !option.includes('any other')) {
      parsedCodes.push(...SubjectGroups.II);
    } else if (option.includes('group iii') && !option.includes('any other')) {
      parsedCodes.push(...SubjectGroups.III);
    } else if (option.includes('group iv') && !option.includes('any other')) {
      parsedCodes.push(...SubjectGroups.IV);
    } else if (option.includes('group v') && !option.includes('any other')) {
      parsedCodes.push(...SubjectGroups.V);
    }
  }

  return parsedCodes.length > 0 ? parsedCodes : Object.keys(mapping); // Fallback to any if unparsable currently
};

// Takes "Any Other Group II / III / IV / V Subject" logic
const extractAnyOtherFromGroups = (str, excludedCodes = []) => {
  const codes = [];
  const lowerStr = str.toLowerCase();
  
  if (lowerStr.includes('any other') || lowerStr.includes('any subject')) {
    if (lowerStr.includes('group ii') || lowerStr.includes('any subject')) codes.push(...SubjectGroups.II);
    if (lowerStr.includes('group iii') || lowerStr.includes('any subject')) codes.push(...SubjectGroups.III);
    if (lowerStr.includes('group iv') || lowerStr.includes('any subject')) codes.push(...SubjectGroups.IV);
    if (lowerStr.includes('group v') || lowerStr.includes('any subject')) codes.push(...SubjectGroups.V);
    
    // Fallback: If it specifically just says "Any Subject 3", include all groups just in case
    if (codes.length === 0) {
       codes.push(...SubjectGroups.I, ...SubjectGroups.II, ...SubjectGroups.III, ...SubjectGroups.IV, ...SubjectGroups.V);
    }
  }

  return codes.filter(c => !excludedCodes.includes(c));
};

module.exports = { SubjectGroups, gradePoints, parseSubjectString, extractAnyOtherFromGroups };
