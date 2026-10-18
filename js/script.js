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
  if (slidesWrapper) {
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
  }

  function fillFlowerModal(modal, key) {
    if (typeof FLOWERS === "undefined" || !FLOWERS[key]) {
      console.error("No flower data found for:", key);
      return;
    }
    const flower = FLOWERS[key];
    const image = modal.querySelector("[data-flower-image]");
    image.src = flower.image;
    image.alt = flower.alt;
    image.className = `${flower.imageClass}`;
    modal.querySelector("[data-flower-title]").textContent = flower.title;
    modal.querySelector("[data-flower-scientific]").textContent = `(${flower.scientificName})`;
    modal.querySelector("[data-flower-description]").textContent = flower.description;
    modal.querySelectorAll("[data-flower-link]").forEach((link) => (link.href = flower.link));
    modal.querySelector("[data-flower-close-label]").setAttribute("aria-label", `Close ${flower.title} details`);
  }

  function openModal(modal, trigger) {
    if (trigger.dataset.flower) fillFlowerModal(modal, trigger.dataset.flower);
    modal.showModal();
  }

  function setupModal(modal) {
    if (!modal.id) {
      console.error("Modal is missing an id:", modal);
      return;
    }

    document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
      if (trigger.dataset.modalTarget !== modal.id) return;

      trigger.addEventListener("click", () => openModal(modal, trigger));

      if (trigger.getAttribute("role") === "button" && !trigger.matches("button, a")) {
        trigger.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(modal, trigger);
          }
        });
      }
    });

    modal.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
      closeButton.addEventListener("click", () => modal.close());
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  }

  document.querySelectorAll("dialog[data-modal]").forEach(setupModal);
});