const header = document.querySelector("[data-headerr]");
const backTopBtn = document.querySelector("[data-back-top-btnn]");

const headerActive = function () {
  if (window.scrollY < 80) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);