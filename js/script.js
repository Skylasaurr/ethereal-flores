fetch('components/header.html')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
  })
  .catch(error => console.error('Error loading header:', error));

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        footerPlaceholder.querySelector('[data-current-year]').textContent = new Date().getFullYear();
      })
      .catch(error => console.error('Error loading footer:', error));
  }

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

  function setupImageSkeletons() {
    document.querySelectorAll("[data-flower] img").forEach((img) => {
      const card = img.parentElement;
      if (img.complete) return; // already loaded (e.g. from cache), no skeleton needed

      const skeleton = document.createElement("div");
      skeleton.setAttribute("aria-hidden", "true");
      skeleton.className =
        "pointer-events-none absolute inset-0 z-10 animate-pulse bg-slate-200 transition-opacity duration-300";
      skeleton.innerHTML = '<div class="absolute bottom-3 left-2 h-3 w-2/3 rounded bg-slate-300"></div>';
      card.appendChild(skeleton);

      const reveal = () => {
        skeleton.classList.add("opacity-0");
        setTimeout(() => skeleton.remove(), 300);
      };
      img.addEventListener("load", reveal, { once: true });
      img.addEventListener("error", reveal, { once: true }); // never pulse forever on a broken image
    });
  }

  setupImageSkeletons();

  document.querySelectorAll("dialog[data-modal]").forEach(setupModal);
});
