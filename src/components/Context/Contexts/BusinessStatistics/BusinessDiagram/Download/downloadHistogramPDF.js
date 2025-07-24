import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import georgianFont from "../../../../../../assets/fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadHistogramPDF = (
  language,
  yearlyRegionData,
  indicatorYear,
  indicator,
  unit,
  isGender,
  isEmployees,
  selectedRegion
) => {
  const doc = new jsPDF();

  const isGeorgian = language === "ge";

  if (isGeorgian) {
    doc.addFont(georgianFont, "NotoSansGeorgian", "normal");
    doc.addFont(georgianFont, "NotoSansGeorgian", "bold");
    doc.setFont("NotoSansGeorgian");
  }

  const fontStyles = {
    font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
    fontSize: 10,
    halign: "center", // 👈 Center header text horizontally
    valign: "middle", // (optional) vertical centering for taller rows
  };

  const yearHeader = language === "en" ? "Year" : "წელი";
  const indicatorHeader = `${indicator} (${unit})`;
  const maleHeader = language === "en" ? "Male" : "მამაკაცი";
  const femaleHeader = language === "en" ? "Female" : "ქალი";

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formatValue = (value) => {
    return isEmployees ? Math.floor(value) : formatter.format(value);
  };

  let head = [];
  let body = [];

  if (isGender) {
    // Multi-row header
    head = [
      [yearHeader, indicatorHeader, ""],
      ["", maleHeader, femaleHeader],
    ];

    body = yearlyRegionData.map((item) => [
      item.year,
      formatValue(item.maleNumber),
      formatValue(item.femaleNumber),
    ]);
  } else {
    head = [[yearHeader, indicatorHeader]];
    body = yearlyRegionData.map((item) => [
      item.year,
      formatValue(item.number),
    ]);
  }

  const regionName = selectedRegion || "Region";
  const fileName =
    language === "en"
      ? `${indicator}(${regionName})_from_${indicatorYear}.pdf`
      : `${indicator}(${regionName})_${indicatorYear}_დან.pdf`;

  // Add title
  doc.setFontSize(14);

  // Add table
  autoTable(doc, {
    startY: 30,
    head: head,
    body: body,
    theme: "grid",
    styles: {
      ...fontStyles,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    margin: { top: 30 },
    didParseCell: function (data) {
      if (data.section === "head") {
        // Second header row (index 1)
        if (data.row.index === 1) {
          data.cell.styles.fillColor = [255, 165, 0]; // Different blue
          data.cell.styles.textColor = 255;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  doc.save(fileName);
};

export default downloadHistogramPDF;
