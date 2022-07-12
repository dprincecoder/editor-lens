const fileInput = document.querySelector(".file-input"),
  chooseImgBtn = document.querySelector(".choose-img"),
  prevImg = document.querySelector(".preview-img img"),
  fileName = document.querySelector(".filter-info .name"),
  sliderValue = document.querySelector(".slider  input"),
  filterValue = document.querySelector(".filter-info .value"),
  filterOptions = document.querySelectorAll(".filter button"),
  resetFiltersBtn = document.querySelector(".controls .reset-filter"),
  saveImgBtn = document.querySelector(".row .save-img"),
  rotateOptions = document.querySelectorAll(".rotate button");

let brightness = 100,
  contrast = 100,
  saturation = 100;
let inversion = 0,
  blur = 0;
grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;
chooseImgBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  let file = fileInput.files[0];

  if (!file) {
    return;
  } else {
    document.querySelector(".container").classList.remove("disable");
    resetFiltersBtn.click();
  }

  prevImg.src = URL.createObjectURL(file);
});

filterOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    opt.classList.add("active");
    fileName.textContent = opt.innerText;

    switch (opt.id) {
      case "brightness":
        sliderValue.max = "200";
        sliderValue.value = brightness;
        filterValue.innerText = `${brightness}%`;
        break;
      case "saturation":
        sliderValue.max = "200";
        sliderValue.value = saturation;
        filterValue.innerText = `${saturation}%`;
        break;
      case "inversion":
        sliderValue.max = "100";
        sliderValue.value = inversion;
        filterValue.innerText = `${inversion}%`;
        break;
      case "contrast":
        sliderValue.max = "200";
        sliderValue.value = contrast;
        filterValue.innerText = `${contrast}%`;
        break;
      case "blur":
        sliderValue.max = "100";
        sliderValue.value = blur;
        filterValue.innerText = `${blur}%`;
        break;
      default:
        sliderValue.max = "100";
        sliderValue.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
    }
  });
});

sliderValue.addEventListener("input", () => {
  filterValue.textContent = `${sliderValue.value}%`;
  const selectedFilter = document.querySelector(".filter .active");
  switch (selectedFilter.id) {
    case "brightness":
      brightness = sliderValue.value;
      break;
    case "saturation":
      saturation = sliderValue.value;
      break;
    case "inversion":
      inversion = sliderValue.value;
      break;
    case "contrast":
      contrast = sliderValue.value;
      break;
    case "blur":
      blur = sliderValue.value /  30;
      break;
    default:
      grayscale = sliderValue.value;
  }

  applyFilters();
});

const applyFilters = () => {
  prevImg.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`;
  prevImg.style.filter = `
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        contrast(${contrast}%)
        blur(${blur}px)

        grayscale(${grayscale}%)
    `;
};

rotateOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    switch (opt.id) {
      case "left":
        rotate -= 90;
        break;
      case "right":
        rotate += 90;

        break;
      case "horizontal":
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        break;
      default:
        flipVertical = flipVertical === 1 ? -1 : 1;
    }

    applyFilters();
  });
});

resetFiltersBtn.addEventListener("click", () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
});

saveImgBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = prevImg.naturalWidth;
  canvas.height = prevImg.naturalHeight;

  ctx.filter = `
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        contrast(${contrast}%)
        blur(${blur}px)

        grayscale(${grayscale}%)
    `;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);

  ctx.drawImage(
    prevImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  const imgName = new Date().getTime();
  const link = document.createElement("a");
  link.download = `lens_${imgName}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
