import { createToast } from './utils.js';

const TABLE_HEADERS = ['Student ID','Full Name','Gender','Email','Program','Year Level','University','Actions'];

export const cache = () => ({
  form: document.getElementById('student-form'),
  tableContainer: document.getElementById('table-container'),
  emptyState: document.getElementById('empty-state'),
  search: document.getElementById('search'),
  filterGender: document.getElementById('filter-gender'),
  filterProgram: document.getElementById('filter-program'),
  filterYear: document.getElementById('filter-year'),
  resetBtn: document.getElementById('reset-btn'),
});

export const getFormData = (form) => {
  const fd = new FormData(form);
  const obj = {};
  for (const [k,v] of fd.entries()) obj[k]=v?.trim?.() || v;
  return obj;
};

export const fillForm = (form, data) => {
  for (const key of Object.keys(data)) {
    const el = form.elements[key];
    if (el) el.value = data[key];
  }
};

export const clearForm = (form) => {
  form.reset();
  // clear validation markers
  Array.from(form.querySelectorAll('.input-invalid')).forEach(e=>e.classList.remove('input-invalid'));
  Array.from(form.querySelectorAll('.input-valid')).forEach(e=>e.classList.remove('input-valid'));
  Array.from(form.querySelectorAll('.error-message')).forEach(e=>e.textContent='');
};

const createCell = (text) => {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
};

export const renderTable = (container, students, onEdit, onDelete) => {
  container.innerHTML = '';
  if (!students || students.length === 0) return;

  const table = document.createElement('table');
  table.className = 'min-w-full fade-in';

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  TABLE_HEADERS.forEach(h=>{ 
    const th = document.createElement('th'); 
    th.textContent = h; 
    tr.appendChild(th); 
  });
  thead.appendChild(tr);

  const tbody = document.createElement('tbody');
  students.forEach((s, idx) => {
    const row = document.createElement('tr');
    row.style.animationDelay = `${idx * 0.05}s`;
    row.className = 'fade-in';
    
    row.appendChild(createCell(s.studentId));
    row.appendChild(createCell(s.fullName));
    
    // Gender with badge
    const genderCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge badge-${s.gender.toLowerCase()}`;
    badge.textContent = s.gender;
    genderCell.appendChild(badge);
    row.appendChild(genderCell);
    
    row.appendChild(createCell(s.email));
    row.appendChild(createCell(s.program));
    row.appendChild(createCell(s.yearLevel));
    row.appendChild(createCell(s.university));

    const actions = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.className = 'action-btn btn-edit';
    editBtn.addEventListener('click', () => onEdit(s));
    
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    delBtn.className = 'action-btn btn-delete';
    delBtn.addEventListener('click', async () => {
      if (!confirm('⚠️ Are you sure you want to delete this student?')) return;
      try {
        await onDelete(s.id);
        createToast('Student deleted successfully', 'success');
      } catch (err) { 
        createToast(err.message||'Failed to delete', 'error'); 
      }
    });
    
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    row.appendChild(actions);
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
};

export const setEmptyState = (emptyStateEl, hasData) => {
  emptyStateEl.style.display = hasData ? 'none' : 'block';
};

export const populateProgramFilter = (programEl, students) => {
  const uniques = Array.from(new Set(students.map(s=>s.program))).filter(Boolean).sort();
  programEl.innerHTML = '<option value="">All programs</option>' + uniques.map(p=>`<option>${p}</option>`).join('');
};

export const showError = (form, errors) => {
  // errors is an object mapping field->message
  for (const el of form.querySelectorAll('.error-message')) el.textContent='';
  for (const key of Object.keys(errors || {})) {
    const msg = errors[key];
    const errEl = form.querySelector(`.error-message[data-for="${key}"]`);
    const input = form.elements[key];
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('fade-in');
    }
    if (input) {
      input.classList.remove('input-valid');
      input.classList.add('input-invalid');
    }
  }
};

export const markValid = (input) => {
  input.classList.remove('input-invalid');
  input.classList.add('input-valid');
};
