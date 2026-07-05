document.documentElement.classList.add("is-ready");

let stableViewportWidth = window.innerWidth;

const setStableHeroHeight = () => {
  document.documentElement.style.setProperty(
    "--hero-height",
    `${window.innerHeight}px`,
  );
};

setStableHeroHeight();

window.addEventListener("orientationchange", () => {
  window.setTimeout(() => {
    stableViewportWidth = window.innerWidth;
    setStableHeroHeight();
  }, 250);
});

window.addEventListener("resize", () => {
  if (window.innerWidth === stableViewportWidth) {
    return;
  }

  stableViewportWidth = window.innerWidth;
  setStableHeroHeight();
});

const galleryPhotos = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    src: `../img/gallery/${number}.png`,
    fallbackSrc: `../img/gallery/${number}.jpg`,
    alt: `유주의 사진 ${index + 1}`,
    caption: `Yuju photo ${number}`,
  };
});

const galleryPhoto = document.querySelector("#galleryPhoto");
const galleryCaption = document.querySelector("#galleryCaption");
const galleryPrev = document.querySelector("#galleryPrev");
const galleryNext = document.querySelector("#galleryNext");
const galleryDots = document.querySelector("#galleryDots");
const galleryFrame = document.querySelector(".gallery-frame");

let galleryIndex = 0;
let galleryDragStartX = 0;
let galleryDragStartY = 0;
let galleryDragCurrentX = 0;
let isGalleryDragging = false;

const renderGalleryDots = () => {
  galleryDots.innerHTML = galleryPhotos
    .map(
      (_, index) => `
        <button
          class="gallery-dot${index === galleryIndex ? " is-active" : ""}"
          type="button"
          aria-label="${index + 1}번째 사진 보기"
          ${index === galleryIndex ? 'aria-current="true"' : ""}
          data-gallery-index="${index}"
        ></button>
      `,
    )
    .join("");
};

const renderGalleryPhoto = () => {
  const photo = galleryPhotos[galleryIndex];

  galleryPhoto.onerror = () => {
    galleryPhoto.onerror = () => {
      galleryPhoto.onerror = null;
      galleryPhoto.src = "../img/main.png";
    };
    galleryPhoto.src = photo.fallbackSrc;
  };
  galleryPhoto.src = photo.src;
  galleryPhoto.alt = photo.alt;
  galleryCaption.textContent = photo.caption;
  renderGalleryDots();
};

const moveGallery = (direction) => {
  galleryIndex =
    (galleryIndex + direction + galleryPhotos.length) % galleryPhotos.length;
  renderGalleryPhoto();
};

galleryPrev.addEventListener("click", () => moveGallery(-1));
galleryNext.addEventListener("click", () => moveGallery(1));

galleryDots.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-gallery-index]");

  if (!dot) {
    return;
  }

  galleryIndex = Number(dot.dataset.galleryIndex);
  renderGalleryPhoto();
});

galleryFrame.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) {
    return;
  }

  isGalleryDragging = true;
  galleryDragStartX = event.clientX;
  galleryDragStartY = event.clientY;
  galleryDragCurrentX = event.clientX;
  galleryFrame.setPointerCapture(event.pointerId);
});

galleryFrame.addEventListener("pointermove", (event) => {
  if (!isGalleryDragging) {
    return;
  }

  galleryDragCurrentX = event.clientX;
});

galleryFrame.addEventListener("pointerup", (event) => {
  if (!isGalleryDragging) {
    return;
  }

  const deltaX = galleryDragCurrentX - galleryDragStartX;
  const deltaY = event.clientY - galleryDragStartY;
  const didSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY);

  isGalleryDragging = false;

  if (galleryFrame.hasPointerCapture(event.pointerId)) {
    galleryFrame.releasePointerCapture(event.pointerId);
  }

  if (!didSwipe) {
    return;
  }

  moveGallery(deltaX < 0 ? 1 : -1);
});

galleryFrame.addEventListener("pointercancel", (event) => {
  isGalleryDragging = false;

  if (galleryFrame.hasPointerCapture(event.pointerId)) {
    galleryFrame.releasePointerCapture(event.pointerId);
  }
});

renderGalleryPhoto();
