const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const fs = require('fs');

class OCRService {
  /**
   * Main entry point for OCR and parsing
   */
  static async processFile(filePath, mimetype) {
    let text = '';

    if (mimetype === 'application/pdf') {
      text = await this.extractTextFromPDF(filePath);
    } else {
      text = await this.extractTextFromImage(filePath);
    }

    return this.parseKCSEResults(text);
  }

  static async extractTextFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  }

  static async extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  static parseKCSEResults(text) {
    const subjects = {};
    
    // Improved Regex for subject and grade mapping
    // Matches patterns like: "ENG A", "MAT A-", "KISWAHILI B+", "ENGLISH B"
    const subjectRegex = /([A-Z]{3,10}|[A-Z]{3}\s[A-Z]{3,10})\s+([A-D][+-]?|E)/gi;
    let match;

    while ((match = subjectRegex.exec(text)) !== null) {
      const name = match[1].trim().toUpperCase();
      const grade = match[2].trim().toUpperCase();
      
      // Normalize subject names to standard codes
      const code = this.normalizeSubjectCode(name);
      if (code) {
        subjects[code] = grade;
      }
    }

    // Extract Mean Grade
    const meanGradeMatch = /MEAN\s*GRADE[:\s]*([A-D][+-]?|E)/i.exec(text);
    const meanGrade = meanGradeMatch ? meanGradeMatch[1].toUpperCase() : null;

    // Extract Total Points
    const totalPointsMatch = /TOTAL\s*POINTS[:\s]*(\d+)/i.exec(text);
    const totalPoints = totalPointsMatch ? parseInt(totalPointsMatch[1]) : 0;

    // Extract Name
    const nameMatch = /NAME[:\s]*([A-Z\s]+)/i.exec(text);
    const candidateName = nameMatch ? nameMatch[1].trim() : "Unknown Candidate";

    return {
      subjects,
      meanGrade,
      totalPoints,
      candidateName,
      rawText: text
    };
  }

  static normalizeSubjectCode(name) {
    const mapping = {
      'ENGLISH': 'ENG',
      'ENG': 'ENG',
      'KISWAHILI': 'KIS',
      'KIS': 'KIS',
      'MATHEMATICS': 'MAT',
      'MAT': 'MAT',
      'MATHS': 'MAT',
      'BIOLOGY': 'BIO',
      'BIO': 'BIO',
      'CHEMISTRY': 'CHEM',
      'CHEM': 'CHEM',
      'PHYSICS': 'PHY',
      'PHY': 'PHY',
      'HISTORY': 'HIST',
      'HIST': 'HIST',
      'GEOGRAPHY': 'GEO',
      'GEO': 'GEO',
      'RELIGIOUS': 'CRE', // Handles CRE/IRE/HRE
      'CRE': 'CRE',
      'IRE': 'IRE',
      'HRE': 'HRE',
      'BUSINESS': 'BST',
      'BST': 'BST',
      'AGRICULTURE': 'AGRI',
      'AGR': 'AGRI',
      'HOME SCIENCE': 'HSC',
      'HSC': 'HSC',
      'FRENCH': 'FRE',
      'FRE': 'FRE',
      'GERMAN': 'GER',
      'GER': 'GER',
      'ARABIC': 'ARA',
      'ARA': 'ARA',
      'MUSIC': 'MUS',
      'MUS': 'MUS',
      'ART': 'ART',
      'DRAWING': 'ART',
      'COMPUTER': 'COMP',
      'COMP': 'COMP'
    };

    for (let key in mapping) {
      if (name.includes(key)) return mapping[key];
    }
    return name; // Return as is if no mapping found
  }
}

module.exports = OCRService;
