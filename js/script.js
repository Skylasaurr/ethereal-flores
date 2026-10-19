const headerPlaceholder = document.getElementById('header-placeholder');
if (headerPlaceholder) {
  headerPlaceholder.setAttribute('aria-busy', 'true');
  headerPlaceholder.innerHTML = `
    <div role="status" aria-label="Loading navigation">
      <span class="sr-only">Loading navigation</span>
      <header aria-hidden="true" class="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
        <div class="mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div class="flex shrink-0 items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
            <div class="h-5 w-36 rounded bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
          </div>
          <div class="hidden items-center gap-6 md:flex">
            <div class="h-4 w-10 rounded bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
            <div class="h-4 w-12 rounded bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
            <div class="h-4 w-14 rounded bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
            <div class="h-4 w-12 rounded bg-slate-200 motion-reduce:animate-none animate-pulse"></div>
          </div>
          <div class="h-11 w-11 rounded-md bg-slate-200 motion-reduce:animate-none animate-pulse md:hidden"></div>
        </div>
      </header>
    </div>`;

  fetch('components/header.html')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(html => {
      headerPlaceholder.innerHTML = html;
      headerPlaceholder.removeAttribute('aria-busy');
    })
    .catch(error => {
      console.error('Error loading header:', error);
      headerPlaceholder.removeAttribute('aria-busy');
      headerPlaceholder.innerHTML = '<p role="alert" class="fixed inset-x-0 top-0 z-50 bg-white px-4 py-3 text-center text-sm text-red-700 shadow-md">Navigation could not be loaded.</p>';
    });
}

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
      if (img.complete) return; 

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
      img.addEventListener("error", reveal, { once: true });
    });
  }

  setupImageSkeletons();

  document.querySelectorAll("dialog[data-modal]").forEach(setupModal);
});
