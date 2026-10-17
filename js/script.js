fetch('components/header.html')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
  })
  .catch(error => console.error('Error loading header:', error));

  document.addEventListener("DOMContentLoaded", () => {
  const slidesWrapper = document.getElementById("carousel-slides");
  const slides = slidesWrapper.children;
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const indicatorDots = document.querySelectorAll("#indicators button");

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayInterval;

  function updateCarousel() {
    slidesWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    indicatorDots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.remove("bg-white/50", "w-3");
        dot.classList.add("bg-white", "w-6"); 
      } else {
        dot.classList.remove("bg-white", "w-6");
        dot.classList.add("bg-white/50", "w-3");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });


  indicatorDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  const carouselContainer = slidesWrapper.parentElement;
  carouselContainer.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
  carouselContainer.addEventListener("mouseleave", startAutoPlay);

  updateCarousel();
  startAutoPlay();
});