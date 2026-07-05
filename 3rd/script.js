document.documentElement.classList.add("is-ready");

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

let galleryIndex = 0;

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

renderGalleryPhoto();
