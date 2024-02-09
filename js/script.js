import { videoIds, videoUrl, videoplayerUrl, swiperConfig, VIMEO_ACCESS_TOKEN  } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const videoPopup = document.getElementById("video-popup");
  const videoIframe = document.getElementById("video-iframe");
  const closeButton = document.getElementById("close-popup");
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const paginationDiv = document.querySelector(
    "#video-popup .swiper-pagination"
  );

  new Swiper(".swiper-container", swiperConfig);

  const createPlaceholderSlide = (index) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.setAttribute("data-index", index);
    swiperWrapper.appendChild(slide);
  }

  const fetchVideoAndCreateSlide = (videoId, index) => {
    fetch(`${videoUrl}/${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${VIMEO_ACCESS_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const thumbnailUrl = data.pictures.sizes[2].link;
        updateSwiperSlide(videoId, thumbnailUrl, index);
      })
      .catch((error) => console.log(error));
  }

  const updateSwiperSlide = (videoId, thumbnailUrl, index) => {
    const slide = swiperWrapper.querySelector(`div[data-index="${index}"]`);
    slide.style.backgroundImage = `url(${thumbnailUrl})`;
    slide.setAttribute("data-video-id", videoId);

    slide.addEventListener("click", () => {
      const videoUrl = `${videoplayerUrl}/${videoId}?autoplay=1&muted=1`;
      videoIframe.src = videoUrl;
      videoPopup.style.display = "block";
      updatePagination(index);
    });
  }

  const updatePagination = (activeIndex) => {
    paginationDiv.innerHTML = "";
    videoIds.forEach((_, index) => {
      const bullet = document.createElement("span");
      bullet.className = "swiper-pagination-bullet";
      if (index === activeIndex) {
        bullet.classList.add("active");
      }
      bullet.addEventListener("click", () => {
        const videoId = videoIds[index];
        videoIframe.src = `${videoplayerUrl}/${videoId}?autoplay=1&muted=1`;
        updatePagination(index);
      });
      paginationDiv.appendChild(bullet);
    });
  }

  closeButton.addEventListener("click", () => {
    videoPopup.style.display = "none";
    videoIframe.src = "";
  });

  videoIds.forEach((videoId, index) => {
    createPlaceholderSlide(index);
    fetchVideoAndCreateSlide(videoId, index);
  });
});


