const invitation = {
  naverMapUrl: "https://map.naver.com/",
  kakaoMapUrl: "https://map.kakao.com/",
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
      alt: "아기 사진 1",
      label: "01",
    },
    {
      src: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=700&q=80",
      alt: "아기 사진 2",
      label: "02",
    },
    {
      src: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=700&q=80",
      alt: "아기 사진 3",
      label: "03",
    },
    {
      src: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
      alt: "아기 사진 4",
      label: "04",
    },
  ],
};

const galleryGrid = document.querySelector("#galleryGrid");
const naverMapButton = document.querySelector("#naverMapButton");
const kakaoMapButton = document.querySelector("#kakaoMapButton");
const topButton = document.querySelector(".top-button");

naverMapButton.href = invitation.naverMapUrl;
kakaoMapButton.href = invitation.kakaoMapUrl;

galleryGrid.innerHTML = invitation.gallery
  .map(
    (photo) => `
      <figure class="gallery__item">
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" />
        <span>${photo.label}</span>
      </figure>
    `,
  )
  .join("");

const toggleTopButton = () => {
  topButton.classList.toggle("is-visible", window.scrollY > 420);
};

window.addEventListener("scroll", toggleTopButton, { passive: true });

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

toggleTopButton();
