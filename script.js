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

  const getWrappedIndex = (index) =>
    (index + galleryPhotos.length) % galleryPhotos.length;

  const renderGalleryStrip = () => {
    galleryStrip.innerHTML = visibleOffsets
      .map((offset) => {
        const photoIndex = getWrappedIndex(galleryIndex + offset);
        const photo = galleryPhotos[photoIndex];
        const isCenter = offset === 0;

        return `
          <figure class="gallery-card${isCenter ? " gallery-card--center" : ""}">
            ${
              isCenter
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
              src="${photo.src}"
              alt="${photo.alt}"
              loading="${isCenter ? "eager" : "lazy"}"
              onerror="this.onerror=null; this.src='./img/main.png';"
            />
            ${
              isCenter
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
        `;
      })
      .join("");
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
