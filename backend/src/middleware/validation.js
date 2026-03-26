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
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

const resultSchemas = {
  manual: [
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
    body('university_id').isInt().withMessage('Invalid university ID'),
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('type').isIn(['Degree', 'Diploma', 'Certificate']).withMessage('Invalid course type'),
    body('duration').trim().notEmpty().withMessage('Duration is required')
  ]
};

module.exports = {
  validate,
  authSchemas,
  resultSchemas,
  adminSchemas
};
