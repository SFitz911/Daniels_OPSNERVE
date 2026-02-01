const buildSignals = (statements = []) => {
  const board = document.getElementById('signal-board');
  if (!board) return;
  board.innerHTML = '';
  statements.forEach((text, idx) => {
    const card = document.createElement('article');
    card.className = 'signal-card';
    card.innerHTML = `<span>PULSE ${String(idx + 1).padStart(2, '0')}</span><p>${text}</p>`;
    board.appendChild(card);
  });
};

const fetchPulse = async () => {
  try {
    const response = await fetch('/api/pulse');
    const data = await response.json();
    buildSignals(data.statements);
  } catch (error) {
    console.error('Unable to pull signal', error);
  }
};

const handleForm = () => {
  const form = document.getElementById('interest-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending...';
    status.style.color = '#cdd5ff';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to connect');
      }

      status.textContent = result.message;
      status.style.color = '#44ffd2';
      form.reset();
      // brief success highlight
      status.classList.add('notice-success');
      setTimeout(() => {
        status.classList.remove('notice-success');
        status.textContent = '';
      }, 5000);
    } catch (error) {
      status.textContent = error.message || 'Submission failed.';
      status.style.color = '#f76e8a';
      status.classList.add('notice-error');
      setTimeout(() => status.classList.remove('notice-error'), 6000);
    }
    if (submitBtn) submitBtn.disabled = false;
  });
};

const markActiveNav = () => {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  fetchPulse();
  handleForm();
  markActiveNav();
});
