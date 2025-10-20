export const debounce = (fn, wait = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

export const createToast = (msg, type = 'info', timeout = 4000) => {
  const container = document.getElementById('toast');
  const el = document.createElement('div');
  
  const icons = {
    success: '<i class="fas fa-check-circle text-xl"></i>',
    error: '<i class="fas fa-exclamation-circle text-xl"></i>',
    info: '<i class="fas fa-info-circle text-xl"></i>'
  };
  
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    ${icons[type] || icons.info}
    <span>${msg}</span>
  `;
  
  container.appendChild(el);
  
  setTimeout(() => {
    el.classList.add('toast-exit');
    setTimeout(() => el.remove(), 300);
  }, timeout);
};
