/**
 * Basic validation middleware for student payloads.
 * Keeps logic small and readable; returns 400 with errors if any.
 */
const validateStudent = (req, res, next) => {
  try {
    const errors = [];
    const { studentId, fullName, gender, email, program, yearLevel, university } = req.body;

    if (!studentId || typeof studentId !== 'string' || !/^[a-zA-Z0-9]{5,15}$/.test(studentId)) {
      errors.push('studentId is required, alphanumeric, 5-15 chars');
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) {
      errors.push('fullName is required, 2-100 chars');
    }
    const validGenders = ['Male', 'Female', 'Other'];
    if (!gender || !validGenders.includes(gender)) {
      errors.push('gender is required and must be Male/Female/Other');
    }
    if (!email || typeof email !== 'string' || !/^([a-zA-Z0-9._%+-]+)@gmail\.com$/.test(email)) {
      errors.push('email is required and must be a valid Gmail address');
    }
    if (!program || typeof program !== 'string' || program.trim().length < 2 || program.trim().length > 100) {
      errors.push('program is required, 2-100 chars');
    }
    const yl = Number(yearLevel);
    if (!yearLevel || Number.isNaN(yl) || yl < 1 || yl > 5) {
      errors.push('yearLevel is required and must be a number between 1 and 5');
    }
    if (!university || typeof university !== 'string' || university.trim().length < 2 || university.trim().length > 200) {
      errors.push('university is required, 2-200 chars');
    }

    if (errors.length) return res.status(400).json({ success: false, error: errors, message: 'Validation failed' });
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { validateStudent };
