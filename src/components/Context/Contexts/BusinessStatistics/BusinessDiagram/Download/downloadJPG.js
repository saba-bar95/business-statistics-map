import html2canvas from "html2canvas";

const downloadJPG = (e, indicator, indicatorYear) => {
  // Find the closest parent element with the class 'main-chart'
  const chartElement = document.querySelector("#chartdiv");

  if (!chartElement) return; // Ensure the element exists

  // Hide the dropdown content if necessary
  const dropdownContent = e.target
    .closest(".download-container")
    .querySelector(".wrapper");

  if (dropdownContent) {
    dropdownContent.style.display = "none"; // Hide the dropdown
  }

  html2canvas(chartElement, {
    ignoreElements: (element) => element.classList.contains("wrapper"),
  }).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.download = `${indicator} (${indicatorYear}).jpg`;
    link.click();
  });
};

export default downloadJPG;
