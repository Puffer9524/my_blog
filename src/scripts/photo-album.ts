function initPhotoAlbum(element: HTMLElement): void {
  const photos = JSON.parse(element.dataset.photos ?? '[]') as string[];
  const title = element.dataset.title ?? '';
  const stack = element.querySelector<HTMLElement>('.album-stack');
  const front = element.querySelector<HTMLImageElement>('.stack-photo-front');
  const middle = element.querySelector<HTMLImageElement>('.stack-photo-middle');
  const back = element.querySelector<HTMLImageElement>('.stack-photo-back');
  const counter = element.querySelector('.current-index');
  const prevButton = element.querySelector('.album-prev');
  const nextButton = element.querySelector('.album-next');
  const viewButton = element.querySelector<HTMLElement>('.album-main-button');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  let wheelLocked = false;

  function renderPhoto(): void {
    if (photos.length === 0 || !front || !middle || !back) return;
    const at = (offset: number) =>
      photos[(currentIndex + offset + photos.length) % photos.length];
    front.src = at(0);
    front.alt = `${title} ${currentIndex + 1}/${photos.length}`;
    middle.src = at(1);
    back.src = at(2);
    if (counter) counter.textContent = String(currentIndex + 1);
    if (viewButton) {
      viewButton.dataset.lightboxSrc = at(0);
      viewButton.dataset.lightboxTitle = `${title} ${currentIndex + 1}/${photos.length}`;
    }
  }

  function selectAlbum(): void {
    element.classList.add('selected');
    stack?.setAttribute('aria-pressed', 'true');
    element.querySelector('.album-controls')?.setAttribute('aria-hidden', 'false');
  }

  function exitAlbum(): void {
    element.classList.remove('selected');
    stack?.setAttribute('aria-pressed', 'false');
    element.querySelector('.album-controls')?.setAttribute('aria-hidden', 'true');
  }

  function changePhoto(step: number): void {
    if (photos.length < 2) return;
    const animationClass = step > 0 ? 'turn-next' : 'turn-prev';
    stack?.classList.remove('turn-next', 'turn-prev');
    void stack?.offsetWidth;
    stack?.classList.add(animationClass);
    currentIndex = (currentIndex + step + photos.length) % photos.length;
    window.setTimeout(renderPhoto, 160);
    window.setTimeout(() => stack?.classList.remove(animationClass), 360);
  }

  stack?.addEventListener('click', () => {
    if (touchMoved) {
      touchMoved = false;
      return;
    }
    if (coarsePointer.matches) {
      viewButton?.click();
      return;
    }
    if (!element.classList.contains('selected')) {
      selectAlbum();
      return;
    }
    viewButton?.click();
  });

  stack?.addEventListener('wheel', (event) => {
    if (coarsePointer.matches || !element.classList.contains('selected')) return;
    event.preventDefault();
    if (wheelLocked || Math.abs(event.deltaY) < 8) return;
    wheelLocked = true;
    changePhoto(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked = false; }, 380);
  }, { passive: false });

  stack?.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchMoved = false;
  }, { passive: true });

  stack?.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY)) {
      touchMoved = true;
      selectAlbum();
      changePhoto(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });

  prevButton?.addEventListener('click', () => changePhoto(-1));
  nextButton?.addEventListener('click', () => changePhoto(1));
  document.addEventListener('pointerdown', (event) => {
    if (!element.contains(event.target as Node)) exitAlbum();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && element.classList.contains('selected')) {
      exitAlbum();
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-photo-album]').forEach(initPhotoAlbum);
