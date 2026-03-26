const gradePoints = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
  'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3,
  'D-': 2, 'E': 1
};

const calculatePoints = (grade) => {
  return gradePoints[grade] || 0;
};

const calculateTotalPoints = (subjects) => {
  return Object.values(subjects).reduce((total, grade) => {
    return total + calculatePoints(grade);
  }, 0);
};

module.exports = {
  gradePoints,
  calculatePoints,
  calculateTotalPoints
};
