const invitation = {
  naverMapUrl: "https://naver.me/FCAfNJUo",
  kakaoMapUrl: "https://place.map.kakao.com/1540127315",
  photos: [
    {
      src: "../img/gallery/01.png",
      alt: "선글라스를 쓴 유주",
      caption: "Happy first birthday, Yuju!",
      position: "50% 34%",
    },
    {
      src: "../img/gallery/02.jpg",
      alt: "선글라스를 쓴 유주의 미소",
      caption: "Tiny hands, big smiles",
      position: "42% 28%",
    },
    {
      src: "../img/gallery/03.jpg",
      alt: "생일 파티의 주인공 유주",
      caption: "Our birthday star",
      position: "62% 42%",
    },
    {
      src: "../img/gallery/04.jpg",
      alt: "유주의 네 번째 사진",
      caption: "Sweet little moment",
      position: "50% 40%",
    },
    {
      src: "../img/gallery/05.jpg",
      alt: "유주의 다섯 번째 사진",
      caption: "One year of love",
      position: "50% 35%",
    },
    {
      src: "../img/gallery/06.jpg",
      alt: "유주의 여섯 번째 사진",
      caption: "Party mood on",
      position: "48% 36%",
    },
    {
      src: "../img/gallery/07.jpg",
      alt: "유주의 일곱 번째 사진",
      caption: "Our tiny sunshine",
      position: "50% 32%",
    },
    {
      src: "../img/gallery/08.jpg",
      alt: "유주의 여덟 번째 사진",
      caption: "A day to remember",
      position: "52% 38%",
    },
    {
      src: "../img/gallery/09.jpg",
      alt: "유주의 아홉 번째 사진",
      caption: "So much joy",
      position: "50% 36%",
    },
    {
      src: "../img/gallery/10.jpg",
      alt: "유주의 열 번째 사진",
      caption: "Yuju turns one",
      position: "50% 34%",
    },
  ],
};

const naverMapButton = document.querySelector("#naverMapButton");
const kakaoMapButton = document.querySelector("#kakaoMapButton");
const topButton = document.querySelector(".top-button");
const photoCarousel = document.querySelector(".photo-carousel");
const photoViewport = document.querySelector("#photoCarousel");
const photoDots = document.querySelector("#photoDots");
const photoPrevButton = document.querySelector("#photoPrevButton");
const photoNextButton = document.querySelector("#photoNextButton");

let currentPhotoIndex = 0;

naverMapButton.href = invitation.naverMapUrl;
kakaoMapButton.href = invitation.kakaoMapUrl;

const renderPhoto = () => {
  const photo = invitation.photos[currentPhotoIndex];

  photoViewport.innerHTML = `
    <figure class="baby-card is-changing">
      <img
        src="${photo.src}"
        alt="${photo.alt}"
        onerror="this.onerror=null; this.src='../img/main.png';"
        style="object-position: ${photo.position}"
      />
      <figcaption>${photo.caption}</figcaption>
    </figure>
  `;

  photoDots.innerHTML = invitation.photos
    .map(
      (_, index) => `
        <button
          class="photo-carousel__dot${index === currentPhotoIndex ? " is-active" : ""}"
          type="button"
          aria-label="${index + 1}번째 사진 보기"
          ${index === currentPhotoIndex ? 'aria-current="true"' : ""}
          data-photo-index="${index}"
        ></button>
      `,
    )
    .join("");
};

const movePhoto = (direction) => {
  currentPhotoIndex =
    (currentPhotoIndex + direction + invitation.photos.length) %
    invitation.photos.length;
  renderPhoto();
};

photoPrevButton.addEventListener("click", () => movePhoto(-1));
photoNextButton.addEventListener("click", () => movePhoto(1));

photoDots.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-photo-index]");

  if (!dot) {
    return;
  }

  currentPhotoIndex = Number(dot.dataset.photoIndex);
  renderPhoto();
});

photoCarousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    movePhoto(-1);
  }

  if (event.key === "ArrowRight") {
    movePhoto(1);
  }
});

const toggleTopButton = () => {
  topButton.classList.toggle("is-visible", window.scrollY > 420);
};

window.addEventListener("scroll", toggleTopButton, { passive: true });

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderPhoto();
toggleTopButton();
