const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

const authSchemas = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Enter a valid email').customSanitizer(v => v.toLowerCase().trim()),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Enter a valid email').customSanitizer(v => v.toLowerCase().trim()),
    body('password').notEmpty().withMessage('Password is required')
  ],
  forgotPassword: [
    body('email').isEmail().withMessage('Enter a valid email').customSanitizer(v => v.toLowerCase().trim())
  ],
  resetPassword: [
    body('email').isEmail().withMessage('Enter a valid email').customSanitizer(v => v.toLowerCase().trim()),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]
};

const resultSchemas = {
  manual: [
    body('aggregatePoints')
      .notEmpty().withMessage('Aggregate points is required')
      .isInt({ min: 0, max: 84 }).withMessage('Must be an integer between 0 and 84'),
    body('subjects').isObject().withMessage('Subjects must be an object'),
    body('subjects.*').isIn(['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E']).withMessage('Invalid grade'),
    body('meanGrade').optional().isIn(['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E']).withMessage('Invalid mean grade')
  ]
};

const adminSchemas = {
  university: [
    body('name').trim().notEmpty().withMessage('University name is required'),
    body('type').isIn(['Public', 'Private']).withMessage('Type must be Public or Private'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('website_url').optional().isURL().withMessage('Enter a valid URL')
  ],
  course: [
    body('university_id').notEmpty().isUUID().withMessage('Invalid university ID'),
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('type').isIn(['Degree', 'Diploma', 'Certificate']).withMessage('Invalid course type'),
    body('duration').trim().notEmpty().withMessage('Duration is required'),
    body('cut_off_points').optional().isFloat({ min: 0, max: 84 }).withMessage('Cut-off points must be between 0 and 84')
  ],
  clusters: [
    body('subjects').isArray({ min: 4, max: 4 }).withMessage('Exactly 4 cluster subjects are required'),
    body('subjects.*').isString().notEmpty().withMessage('Each subject must be a valid string')
  ],
  cutoffYear: [
    body('year').isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid integer'),
    body('cut_off_points').isFloat({ min: 0, max: 84 }).withMessage('Cut-off points must be between 0 and 84')
  ]
};

module.exports = {
  validate,
  authSchemas,
  resultSchemas,
  adminSchemas
};
