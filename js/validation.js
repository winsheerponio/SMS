export const validate = (data) => {
  const errors = {};
  
  // Student ID validation
  if (!data.studentId || !data.studentId.trim()) {
    errors.studentId = 'Student ID is required';
  }
  
  // Full Name validation
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  }
  
  // Email validation (optional but must be valid if provided)
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }
  
  // Gender validation
  if (!data.gender || !data.gender.trim()) {
    errors.gender = 'Gender is required';
  }
  
  // Year Level validation
  if (!data.yearLevel) {
    errors.yearLevel = 'Year Level is required';
  } else {
    const year = parseInt(data.yearLevel);
    if (isNaN(year) || year < 1 || year > 6) {
      errors.yearLevel = 'Year Level must be between 1 and 6';
    }
  }
  
  // Program validation
  if (!data.program || !data.program.trim()) {
    errors.program = 'Program is required';
  }
  
  // University validation
  if (!data.university || !data.university.trim()) {
    errors.university = 'University is required';
  }
  
  return errors;
};

export default { validate };
