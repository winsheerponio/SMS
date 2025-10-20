import * as api from './api.js';
import { cache, getFormData, clearForm, fillForm, renderTable, setEmptyState, populateProgramFilter, showError, markValid } from './dom.js';
import { validate } from './validation.js';
import { debounce, createToast } from './utils.js';

const state = { students: [], editingId: null, filters: {} };

const updateStats = () => {
  const { students } = state;
  document.getElementById('student-count').textContent = students.length;
  document.getElementById('male-count').textContent = students.filter(s => s.gender === 'Male').length;
  document.getElementById('female-count').textContent = students.filter(s => s.gender === 'Female').length;
  document.getElementById('other-count').textContent = students.filter(s => s.gender === 'Other').length;
  const uniquePrograms = new Set(students.map(s => s.program)).size;
  const progCount = document.getElementById('program-count');
  const progCountDash = document.getElementById('program-count-dash');
  if (progCount) progCount.textContent = uniquePrograms;
  if (progCountDash) progCountDash.textContent = uniquePrograms;
};

const updateFilteredCount = (count) => {
  const el = document.getElementById('filtered-count');
  if (el) el.textContent = count;
};

const updateFormTitle = (isEditing) => {
  const titleEl = document.getElementById('form-title');
  const submitTextEl = document.getElementById('submit-text');
  if (titleEl) {
    titleEl.innerHTML = isEditing 
      ? '<i class="fas fa-edit mr-2"></i>Edit Student' 
      : '<i class="fas fa-user-plus mr-2"></i>Add New Student';
  }
  if (submitTextEl) {
    submitTextEl.textContent = isEditing ? 'Update Student' : 'Add Student';
  }
};

const generateRandomStudent = () => {
  const firstNames = ['John', 'Jane', 'Alex', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'Chris', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Martinez', 'Lee', 'Taylor', 'Anderson'];
  const genders = ['Male', 'Female', 'Other'];
  const programs = ['Computer Science', 'Engineering', 'Business Administration', 'Psychology', 'Biology', 'Mathematics'];
  const universities = ['University of Example', 'Tech Institute', 'State University', 'College of Science'];
  
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    studentId: `S${randomNum(10000, 99999)}`,
    fullName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    gender: randomItem(genders),
    email: `student${randomNum(100, 999)}@gmail.com`,
    program: randomItem(programs),
    yearLevel: randomNum(1, 5),
    university: randomItem(universities)
  };
};

const init = async () => {
  const els = cache();

  const load = async () => {
    try {
      state.students = await api.fetchStudents();
      applyFiltersAndRender();
      populateProgramFilter(els.filterProgram, state.students);
      updateStats();
    } catch (err) { 
      console.error(err); 
      createToast(err.message||'Failed to load students', 'error'); 
    }
  };

  const applyFiltersAndRender = () => {
    const { search, filterGender, filterProgram, filterYear } = state.filters;
    let out = [...state.students];
    if (search) out = out.filter(s=>s.fullName.toLowerCase().includes(search.toLowerCase()));
    if (filterGender) out = out.filter(s=>s.gender===filterGender);
    if (filterProgram) out = out.filter(s=>s.program===filterProgram);
    if (filterYear) out = out.filter(s=>String(s.yearLevel)===String(filterYear));

    renderTable(els.tableContainer, out, onEdit, onDelete);
    setEmptyState(els.emptyState, out.length>0);
    updateFilteredCount(out.length);
  };

  const onEdit = (student) => {
    state.editingId = student.id;
    fillForm(els.form, student);
    updateFormTitle(true);
    // Smooth scroll to form
    els.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onDelete = async (id) => {
    await api.deleteStudent(id);
    state.students = state.students.filter(s=>s.id!==id);
    applyFiltersAndRender();
    updateStats();
  };

  // Random student generator
  const randomBtn = document.getElementById('random-btn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const randomData = generateRandomStudent();
      fillForm(els.form, randomData);
      createToast('Random data generated! ✨', 'info');
    });
  }

  // Export to CSV
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!state.students.length) return createToast('No students to export', 'error');
      const csv = [
        ['Student ID', 'Full Name', 'Gender', 'Email', 'Program', 'Year Level', 'University'].join(','),
        ...state.students.map(s => [s.studentId, s.fullName, s.gender, s.email, s.program, s.yearLevel, s.university].join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      createToast('Exported successfully! 📥', 'success');
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.querySelector('i').classList.add('fa-spin');
      await load();
      setTimeout(() => refreshBtn.querySelector('i').classList.remove('fa-spin'), 500);
      createToast('Refreshed! 🔄', 'success');
    });
  }

  // Add first student button
  const addFirstBtn = document.getElementById('add-first-student');
  if (addFirstBtn) {
    addFirstBtn.addEventListener('click', () => {
      els.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      els.form.elements['studentId'].focus();
    });
  }

  els.form.addEventListener('input', (e) => {
    const errors = validate(getFormData(els.form));
    const name = e.target.name;
    if (!name) return;
    const errEl = els.form.querySelector(`.error-message[data-for="${name}"]`);
    if (errors[name]) {
      if (errEl) errEl.textContent = errors[name];
      e.target.classList.add('input-invalid');
      e.target.classList.remove('input-valid');
    } else {
      if (errEl) errEl.textContent = '';
      markValid(e.target);
    }
  });

  els.form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = getFormData(els.form);
    const errors = validate(data);
    if (Object.keys(errors).length) return showError(els.form, errors);

    try {
      if (state.editingId) {
        const updated = await api.updateStudent(state.editingId, data);
        state.students = state.students.map(s=>s.id===state.editingId?updated:s);
        createToast('Student updated successfully! 🎉', 'success');
      } else {
        const created = await api.createStudent(data);
        state.students.push(created);
        createToast('Student added successfully! ✨', 'success');
      }
      state.editingId = null;
      clearForm(els.form);
      updateFormTitle(false);
      applyFiltersAndRender();
      populateProgramFilter(els.filterProgram, state.students);
      updateStats();
    } catch (err) {
      createToast(err.message||'Operation failed', 'error');
    }
  });

  els.resetBtn.addEventListener('click', () => { 
    clearForm(els.form); 
    state.editingId=null; 
    updateFormTitle(false);
  });

  const deb = debounce((val) => { state.filters.search = val; applyFiltersAndRender(); }, 300);
  els.search.addEventListener('input', (e)=>deb(e.target.value));

  els.filterGender.addEventListener('change', (e)=>{ state.filters.filterGender = e.target.value; applyFiltersAndRender(); });
  els.filterProgram.addEventListener('change', (e)=>{ state.filters.filterProgram = e.target.value; applyFiltersAndRender(); });
  els.filterYear.addEventListener('change', (e)=>{ state.filters.filterYear = e.target.value; applyFiltersAndRender(); });
  document.getElementById('clear-filters').addEventListener('click', ()=>{
    state.filters = {}; els.search.value=''; els.filterGender.value=''; els.filterProgram.value=''; els.filterYear.value=''; applyFiltersAndRender();
  });

  await load();
};

window.addEventListener('DOMContentLoaded', init);
