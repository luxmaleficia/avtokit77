document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky header ---
  const hd = document.getElementById('hd');
  if (hd) {
    window.addEventListener('scroll', () => {
      hd.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Cases slider ---
  const track = document.querySelector('.cases__track');
  const slides = track ? track.querySelectorAll('.case') : [];
  const prevBtn = document.querySelector('.cases__arrow--prev');
  const nextBtn = document.querySelector('.cases__arrow--next');
  const dots = document.querySelectorAll('.cases__dot');
  let current = 0;

  function goTo(i) {
    if (!track || slides.length === 0) return;
    current = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('cases__dot--active', idx === current));
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, idx) => dot.addEventListener('click', () => goTo(idx)));

  // Init
  goTo(0);

  // Recalc on resize
  window.addEventListener('resize', () => goTo(current));

  // --- Modal form ---
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalSuccess = document.getElementById('modal-success');
  const modalForm = document.getElementById('modal-form');
  const dropZone = document.getElementById('drop-zone');
  const fileList = document.getElementById('file-list');
  const dropContent = document.getElementById('drop-content');
  let uploadedFiles = [];

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  function resetModal() {
    modalBody.style.display = '';
    modalSuccess.style.display = 'none';
    if (modalForm) modalForm.reset();
    uploadedFiles = [];
    fileList.innerHTML = '';
    dropContent.style.display = '';
  }

  // Open buttons
  document.querySelectorAll('.js-open-form').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); resetModal(); openModal(); });
  });

  // Close
  if (modal) {
    modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  // File handling
  if (dropZone) {
    const fileInput = dropZone.querySelector('.modal__file-input');

    function renderFiles() {
      fileList.innerHTML = '';
      if (uploadedFiles.length === 0) {
        dropContent.style.display = '';
        return;
      }
      dropContent.style.display = 'none';
      uploadedFiles.forEach((f, i) => {
        const tag = document.createElement('span');
        tag.className = 'modal__file-tag';
        tag.innerHTML = `${f.name} <button type="button" class="modal__file-rm" data-idx="${i}">&times;</button>`;
        fileList.appendChild(tag);
      });
    }

    function addFiles(files) {
      for (const f of files) uploadedFiles.push(f);
      renderFiles();
    }

    fileInput.addEventListener('change', () => { addFiles(fileInput.files); });

    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      addFiles(e.dataTransfer.files);
    });

    fileList.addEventListener('click', e => {
      const rm = e.target.closest('.modal__file-rm');
      if (rm) {
        uploadedFiles.splice(Number(rm.dataset.idx), 1);
        renderFiles();
      }
    });
  }

  // Submit
  if (modalForm) {
    modalForm.addEventListener('submit', e => {
      e.preventDefault();
      const phone = modalForm.querySelector('[name="phone"]');
      if (!phone.value.trim()) { phone.focus(); return; }

      // TODO: Replace with Formspree/Web3Forms endpoint
      // For now — show success
      modalBody.style.display = 'none';
      modalSuccess.style.display = '';

      setTimeout(closeModal, 4000);
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__a');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq__a').style.maxHeight = '0';
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });

});
