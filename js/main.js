// ── 1. CONTACT FORM VALIDATION ──────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {

  function setError(id, show) {
    const el = document.getElementById(id);
    if (el) show ? el.classList.add('show') : el.classList.remove('show');
  }

  function validateName() {
    const name = document.getElementById('fullName').value.trim();
    const ok = name.length >= 3;
    setError('nameError', !ok);
    return ok;
  }

  function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = emailRx.test(email);
    setError('emailError', !ok);
    return ok;
  }

  function validateSubject() {
    const subject = document.getElementById('subject').value;
    const ok = subject !== '';
    setError('subjectError', !ok);
    return ok;
  }

  function validateMessage() {
    const message = document.getElementById('message').value.trim();
    const ok = message.length >= 20;
    setError('messageError', !ok);
    return ok;
  }

  // Live validation: clear/show errors as the user interacts
  document.getElementById('fullName').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('subject').addEventListener('change', validateSubject);
  document.getElementById('message').addEventListener('input', function () {
    if (this.value.trim().length >= 20) setError('messageError', false);
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameOk = validateName();
    const emailOk = validateEmail();
    const subjectOk = validateSubject();
    const messageOk = validateMessage();
    const valid = nameOk && emailOk && subjectOk && messageOk;

    if (valid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending...';

      setTimeout(() => {
        const alert = document.getElementById('successAlert');
        if (alert) {
          alert.classList.remove('d-none');
          contactForm.reset();
          setTimeout(() => alert.classList.add('d-none'), 5000);
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 900);
    }
  });
}

// ── 2. SIGN-UP FORM VALIDATION ───────────────────────────────
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    function setError(id, show, msg) {
      const el = document.getElementById(id);
      if (!el) return;
      if (show) { el.textContent = msg; el.classList.add('show'); }
      else { el.classList.remove('show'); }
    }

    // Name
    const name = document.getElementById('regName').value.trim();
    if (name.length < 3) {
      setError('regNameError', true, 'Name must be at least 3 characters.'); valid = false;
    } else { setError('regNameError', false); }

    // Email
    const email = document.getElementById('regEmail').value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      setError('regEmailError', true, 'Please enter a valid email.'); valid = false;
    } else { setError('regEmailError', false); }

    // Password
    const pwd = document.getElementById('regPassword').value;
    const pwdRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (pwd.trim() !== pwd) {
      setError('regPwdError', true, 'Password cannot start or end with a space.'); valid = false;
    } else if (!pwdRx.test(pwd)) {
      setError('regPwdError', true, 'Password: 8+ chars, uppercase, lowercase, number, special char.'); valid = false;
    } else { setError('regPwdError', false); }

    // Confirm Password
    const cpwd = document.getElementById('regConfirm').value;
    if (cpwd !== pwd) {
      setError('regConfirmError', true, 'Passwords do not match.'); valid = false;
    } else { setError('regConfirmError', false); }

    if (valid) {
      const succ = document.getElementById('signupSuccess');
      if (succ) {
        succ.classList.remove('d-none');
        signupForm.reset();
      }
    }
  });
}

// ── 3. COURSE SEARCH / FILTER ────────────────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.course-item');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';
      const match = title.includes(query) || category.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle('d-none', visibleCount > 0);
    }
  });
}

// Category filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.getAttribute('data-filter');
    const cards = document.querySelectorAll('.course-item');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    cards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle('d-none', visibleCount > 0);
    }

    // Clear search box when switching filters, for a predictable UX
    const search = document.getElementById('searchInput');
    if (search) search.value = '';
  });
});

// ── 4. DARK MODE TOGGLE ──────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
if (darkToggle) {
  // Load saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  darkToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  });
}

// ── 5. AUTO-CLOSE MOBILE NAV ON LINK CLICK ───────────────────
const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn');
const navCollapse = document.querySelector('.navbar-collapse');
if (navLinks.length && navCollapse) {
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

// ── SIGN IN FORM (SIMULATED) ─────────────────────────────────
const signinForm = document.getElementById('signinForm');
if (signinForm) {
  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('siEmail').value.trim();
    const password = document.getElementById('siPassword').value;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRx.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      alert('Please enter your password.');
      return;
    }

    // No real backend exists yet — simulate a successful login
    window.location.href = 'index.html';
  });
}