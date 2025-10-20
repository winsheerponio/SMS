const fileService = require('../services/fileService');
const { v4: uuidv4 } = require('uuid');

const response = (res, success, dataOrError, message = '') => {
  if (success) return res.json({ success: true, data: dataOrError, message });
  return res.status(400).json({ success: false, error: dataOrError, message });
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await fileService.readStudents();
    return response(res, true, students, 'Students retrieved');
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const students = await fileService.readStudents();
    const student = students.find(s => s.id === id);
    if (!student) return response(res, false, 'Student not found', 'Not found');
    return response(res, true, student, 'Student retrieved');
  } catch (err) {
    next(err);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const payload = req.body;
    const students = await fileService.readStudents();

    // Ensure unique studentId
    if (students.some(s => s.studentId === payload.studentId)) {
      return response(res, false, 'studentId must be unique', 'Validation error');
    }

    const newStudent = {
      id: uuidv4(),
      ...payload,
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    await fileService.writeStudents(students);
    return response(res, true, newStudent, 'Student created');
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const students = await fileService.readStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return response(res, false, 'Student not found', 'Not found');

    // Prevent changing to an existing studentId
    if (students.some((s, i) => s.studentId === payload.studentId && i !== idx)) {
      return response(res, false, 'studentId must be unique', 'Validation error');
    }

    const updated = { ...students[idx], ...payload };
    students[idx] = updated;
    await fileService.writeStudents(students);
    return response(res, true, updated, 'Student updated');
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const students = await fileService.readStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return response(res, false, 'Student not found', 'Not found');
    const removed = students.splice(idx, 1)[0];
    await fileService.writeStudents(students);
    return response(res, true, removed, 'Student deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
