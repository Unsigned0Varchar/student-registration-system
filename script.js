/*
     * Student Registration System — JavaScript
     *
     * Features:
     *  - Add, Edit, Delete student records
     *  - Input validation (name = letters only, ID = numbers, email, contact ≥ 10 digits)
     *  - Prevent empty-row submission
     *  - LocalStorage persistence (data survives page refresh)
     *  - Dynamic vertical scrollbar (added via JS when rows > 5)
     *  - Live search / filter
     *  - Toast notifications
     *  - Stats dashboard
     */

    /* State */
    let students = [];       // In-memory array of student objects
    let editIndex = null;    // Index being edited in modal

    /* LocalStorage helpers */
    /**
     * Loads students from localStorage into the `students` array.
     * Falls back to empty array if nothing is stored yet.
     */
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem('srs_students');
        students = raw ? JSON.parse(raw) : [];
      } catch (e) {
        // Malformed JSON — reset
        students = [];
      }
    }

    /** Saves the current `students` array to localStorage. */
    function saveToStorage() {
      localStorage.setItem('srs_students', JSON.stringify(students));
    }

    /* Validation */
    /**
     * Validates a single field.
     * @param {string} value   - The trimmed input value.
     * @param {string} field   - One of 'name' | 'id' | 'email' | 'contact'.
     * @returns {string}         Error message, or '' if valid.
     */
    function validate(value, field) {
      if (!value) return 'This field is required.';

      if (field === 'name') {
        // Name: letters, spaces, hyphens, apostrophes only
        if (!/^[A-Za-z\s'\-]+$/.test(value))
          return 'Name must contain letters only.';
      }

      if (field === 'id') {
        // Student ID: digits only
        if (!/^\d+$/.test(value))
          return 'Student ID must contain numbers only.';
      }

      if (field === 'email') {
        // Basic email pattern
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Enter a valid email address.';
      }

      if (field === 'contact') {
        // Contact: digits only, at least 10
        if (!/^\d{10,}$/.test(value))
          return 'Contact number must be at least 10 digits.';
      }

      return ''; // Valid
    }

    /**
     * Validates all four fields at once.
     * @param {Object} fields  - { name, id, email, contact }
     * @param {string} prefix  - '' (add form) or 'edit' (modal)
     * @returns {boolean}        True if all fields are valid.
     */
    function validateAll({ name, id, email, contact }, prefix = '') {
      const p = prefix ? prefix + 'Err' : 'err';
      const errName    = validate(name,    'name');
      const errId      = validate(id,      'id');
      const errEmail   = validate(email,   'email');
      const errContact = validate(contact, 'contact');

      setError(p + 'Name',    errName);
      setError(p + 'Id',      errId);
      setError(p + 'Email',   errEmail);
      setError(p + 'Contact', errContact);

      // Mark inputs red if error
      toggleErrorClass('studentName',  errName,    prefix);
      toggleErrorClass('studentId',    errId,      prefix);
      toggleErrorClass('emailId',      errEmail,   prefix);
      toggleErrorClass('contactNo',    errContact, prefix);

      return !errName && !errId && !errEmail && !errContact;
    }

    /** Displays an error message under a field. */
    function setError(id, msg) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }

    /**
     * Toggles the .error CSS class on an input element.
     * Uses different IDs depending on whether we're in the add-form or modal.
     */
    function toggleErrorClass(addFormId, hasError, prefix) {
      // Map add-form IDs to their modal counterparts
      const modalMap = { studentName: 'editName', studentId: 'editId', emailId: 'editEmail', contactNo: 'editContact' };
      const id = prefix ? modalMap[addFormId] : addFormId;
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('error', !!hasError);
    }

    /* Add Student */
    /** Reads the form, validates, and adds a new student to the list. */
    function handleAdd() {
      const name    = document.getElementById('studentName').value.trim();
      const id      = document.getElementById('studentId').value.trim();
      const email   = document.getElementById('emailId').value.trim();
      const contact = document.getElementById('contactNo').value.trim();

      // Validate — stop if any field has errors
      if (!validateAll({ name, id, email, contact })) return;

      // Check for duplicate Student ID
      if (students.some(s => s.id === id)) {
        setError('errId', 'This Student ID already exists.');
        document.getElementById('studentId').classList.add('error');
        return;
      }

      // Add student object to array
      students.push({ name, id, email, contact });
      saveToStorage();

      clearForm();
      renderTable();
      updateStats();
      showToast('Student added successfully!', 'success');
    }

    /* Clear Form */
    /** Resets all form inputs and clears validation errors. */
    function clearForm() {
      ['studentName', 'studentId', 'emailId', 'contactNo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('error'); }
      });
      ['errName', 'errId', 'errEmail', 'errContact'].forEach(id => setError(id, ''));
    }

    /* Delete Student */
    /**
     * Removes a student by index (with confirmation).
     * @param {number} index - Index in the `students` array.
     */
    function deleteStudent(index) {
      if (!confirm(`Delete "${students[index].name}"? This cannot be undone.`)) return;
      students.splice(index, 1);
      saveToStorage();
      renderTable();
      updateStats();
      showToast('Record deleted.', 'warning');
    }

    /* Edit Student (Modal) */
    /**
     * Opens the edit modal pre-filled with a student's data.
     * @param {number} index - Index in the `students` array.
     */
    function openEdit(index) {
      editIndex = index;
      const s = students[index];
      document.getElementById('editName').value    = s.name;
      document.getElementById('editId').value      = s.id;
      document.getElementById('editEmail').value   = s.email;
      document.getElementById('editContact').value = s.contact;

      // Clear any previous modal errors
      ['editErrName', 'editErrId', 'editErrEmail', 'editErrContact'].forEach(id => setError(id, ''));
      ['editName', 'editId', 'editEmail', 'editContact'].forEach(id => {
        document.getElementById(id).classList.remove('error');
      });

      document.getElementById('editModal').classList.add('open');
    }

    /** Closes the edit modal. */
    function closeModal() {
      document.getElementById('editModal').classList.remove('open');
      editIndex = null;
    }

    /** Saves edits from modal back to the students array. */
    function saveEdit() {
      if (editIndex === null) return;

      const name    = document.getElementById('editName').value.trim();
      const id      = document.getElementById('editId').value.trim();
      const email   = document.getElementById('editEmail').value.trim();
      const contact = document.getElementById('editContact').value.trim();

      // Validate modal fields
      const errName    = validate(name,    'name');
      const errId      = validate(id,      'id');
      const errEmail   = validate(email,   'email');
      const errContact = validate(contact, 'contact');

      setError('editErrName',    errName);
      setError('editErrId',      errId);
      setError('editErrEmail',   errEmail);
      setError('editErrContact', errContact);

      document.getElementById('editName').classList.toggle('error',    !!errName);
      document.getElementById('editId').classList.toggle('error',      !!errId);
      document.getElementById('editEmail').classList.toggle('error',   !!errEmail);
      document.getElementById('editContact').classList.toggle('error', !!errContact);

      if (errName || errId || errEmail || errContact) return;

      // Check duplicate ID — allow the same student's own ID
      const duplicate = students.some((s, i) => s.id === id && i !== editIndex);
      if (duplicate) {
        setError('editErrId', 'This Student ID already exists.');
        document.getElementById('editId').classList.add('error');
        return;
      }

      // Update the record
      students[editIndex] = { name, id, email, contact };
      saveToStorage();
      closeModal();
      renderTable();
      updateStats();
      showToast('Record updated successfully!', 'success');
    }

    /* Render Table */
    /**
     * Renders (or re-renders) the student records table.
     * Applies search filter if a query is typed.
     * Also manages the dynamic vertical scrollbar.
     */
    function renderTable() {
      const query   = document.getElementById('searchInput').value.trim().toLowerCase();
      const tbody   = document.getElementById('tableBody');
      const empty   = document.getElementById('emptyState');
      const wrapper = document.getElementById('tableWrapper');

      // Filter by name, ID, or email
      const filtered = students.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)   ||
        s.email.toLowerCase().includes(query)
      );

      // Update count badge
      document.getElementById('recordCount').textContent = filtered.length;

      if (filtered.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
      } else {
        empty.style.display = 'none';
        tbody.innerHTML = filtered.map((s, i) => {
          // Get the actual index in the master array (for edit/delete)
          const masterIndex = students.indexOf(s);
          // Generate avatar initials
          const initials = s.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
          return `
            <tr>
              <td style="color:var(--text-muted);font-size:12px">${i + 1}</td>
              <td>
                <div class="name-cell">
                  <span class="avatar">${initials}</span>
                  <span>${escapeHtml(s.name)}</span>
                </div>
              </td>
              <td><span class="id-badge">${escapeHtml(s.id)}</span></td>
              <td style="color:var(--text-dim)">${escapeHtml(s.email)}</td>
              <td style="color:var(--text-dim)">${escapeHtml(s.contact)}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-edit" onclick="openEdit(${masterIndex})" aria-label="Edit ${escapeHtml(s.name)}">✏ Edit</button>
                  <button class="btn btn-delete" onclick="deleteStudent(${masterIndex})" aria-label="Delete ${escapeHtml(s.name)}">✕ Del</button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      /*
       * DYNAMIC VERTICAL SCROLLBAR (Task 6):
       * If there are more than 5 student rows, we add overflow-y: auto
       * and set a max-height so the table scrolls vertically within its container.
       * When ≤ 5, we remove the constraint so the table grows naturally.
       */
      if (filtered.length > 5) {
        wrapper.style.maxHeight = '360px';
        wrapper.style.overflowY = 'auto';
      } else {
        wrapper.style.maxHeight = '';
        wrapper.style.overflowY = '';
      }
    }

    /* Update Stats */
    /** Refreshes the stats row above the main layout. */
    function updateStats() {
      document.getElementById('statTotal').textContent  = students.length;
      document.getElementById('statActive').textContent = students.length;
      const latestId = students.length ? students[students.length - 1].id : '—';
      document.getElementById('statLatestId').textContent = latestId;
    }

    /* Toast Notifications */
    /**
     * Shows a temporary toast message.
     * @param {string} msg  - The message text.
     * @param {string} type - 'success' | 'error' | 'warning'
     */
    function showToast(msg, type = 'success') {
      const container = document.getElementById('toast-container');
      const icons = { success: '✅', error: '❌', warning: '⚠️' };
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
      container.appendChild(toast);
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
      }, 3000);
    }

    /* Utility: Escape HTML */
    /** Prevents XSS by escaping user-provided strings before injecting into innerHTML. */
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    /* Close modal on backdrop click */
    document.getElementById('editModal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    /* Keyboard: Enter to submit add form */
    ['studentName','studentId','emailId','contactNo'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') handleAdd();
      });
    });

    /* Keyboard: Enter to save edit, Escape to close modal */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    /** Bootstraps the app on page load. */
    (function init() {
      loadFromStorage();
      renderTable();
      updateStats();
    })();