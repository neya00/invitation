document.documentElement.classList.add("is-ready");

const preloadImage = (src) => {
  const image = new Image();
  image.src = src;

  if (image.decode) {
    image.decode().catch(() => {});
  }
};

preloadImage("assets/animal-frame.png");
preloadImage("./img/birthday_girl.png");

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

const galleryStrip = document.querySelector(".gallery-strip");
const galleryPrev = document.querySelector("#galleryPrev");
const galleryNext = document.querySelector("#galleryNext");
const galleryBasePath = "./img/gallery/";

if (galleryStrip) {
  const galleryPhotos = Array.from({ length: 21 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      src: `${galleryBasePath}${number}.jpeg`,
      alt: `유주의 사진 ${index + 1}`,
    };
  });

  const visibleOffsets = [-1, 0, 1];
  let galleryIndex = 0;
  let galleryDragStartX = 0;
  let galleryDragStartY = 0;
  let galleryDragCurrentX = 0;
  let isGalleryDragging = false;

  galleryPhotos.forEach((photo) => {
    const image = new Image();
    image.src = photo.src;
  });

  const getWrappedIndex = (index) =>
    (index + galleryPhotos.length) % galleryPhotos.length;

  galleryStrip.innerHTML = visibleOffsets
    .map(
      (offset) => `
        <figure class="gallery-card${offset === 0 ? " gallery-card--center" : ""}" data-gallery-offset="${offset}">
          ${
            offset === 0
              ? `
                <img
                  class="gallery-frame__deco gallery-frame__deco--elephant"
                  src="assets/elephant.png"
                  alt=""
                  aria-hidden="true"
                />
              `
              : ""
          }
          <img
            class="gallery-photo"
            src=""
            alt=""
            ${offset === 0 ? "" : 'loading="lazy"'}
            onerror="this.onerror=null; this.src='./img/main.png';"
          />
          ${
            offset === 0
              ? `
                <img
                  class="gallery-frame__deco gallery-frame__deco--bunny"
                  src="assets/bunny.png"
                  alt=""
                  aria-hidden="true"
                />
              `
              : ""
          }
        </figure>
      `,
    )
    .join("");

  const galleryCards = Array.from(galleryStrip.querySelectorAll(".gallery-card"));

  const renderGalleryStrip = () => {
    galleryCards.forEach((card) => {
      const offset = Number(card.dataset.galleryOffset);
      const photo = galleryPhotos[getWrappedIndex(galleryIndex + offset)];
      const image = card.querySelector(".gallery-photo");

      if (image.dataset.src !== photo.src) {
        image.src = photo.src;
        image.dataset.src = photo.src;
      }

      image.alt = photo.alt;
    });
  };

  const moveGallery = (direction) => {
    galleryIndex = getWrappedIndex(galleryIndex + direction);
    renderGalleryStrip();
  };

  galleryPrev.addEventListener("click", () => moveGallery(-1));
  galleryNext.addEventListener("click", () => moveGallery(1));

  galleryStrip.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) {
      return;
    }

    isGalleryDragging = true;
    galleryDragStartX = event.clientX;
    galleryDragStartY = event.clientY;
    galleryDragCurrentX = event.clientX;
    galleryStrip.classList.add("is-dragging");
    galleryStrip.setPointerCapture(event.pointerId);
  });

  galleryStrip.addEventListener("pointermove", (event) => {
    if (!isGalleryDragging) {
      return;
    }

    galleryDragCurrentX = event.clientX;
  });

  galleryStrip.addEventListener("pointerup", (event) => {
    if (!isGalleryDragging) {
      return;
    }

    const deltaX = galleryDragCurrentX - galleryDragStartX;
    const deltaY = event.clientY - galleryDragStartY;
    const didSwipe =
      Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY);

    isGalleryDragging = false;
    galleryStrip.classList.remove("is-dragging");

    if (galleryStrip.hasPointerCapture(event.pointerId)) {
      galleryStrip.releasePointerCapture(event.pointerId);
    }

    if (!didSwipe) {
      return;
    }

    moveGallery(deltaX < 0 ? 1 : -1);
  });

  galleryStrip.addEventListener("pointercancel", (event) => {
    isGalleryDragging = false;
    galleryStrip.classList.remove("is-dragging");

    if (galleryStrip.hasPointerCapture(event.pointerId)) {
      galleryStrip.releasePointerCapture(event.pointerId);
    }
  });

  renderGalleryStrip();
}
