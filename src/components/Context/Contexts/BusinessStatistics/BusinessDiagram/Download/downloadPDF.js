import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import georgianFont from "../../../../../../assets/fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

const downloadPDF = (
  language,
  regData,
  indicatorYear,
  indicator,
  unit,
  isGender,
  isEmployees
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
  };

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formatValue = (value) => {
    return isEmployees ? Math.floor(value) : formatter.format(value);
  };

  const filteredData = regData.filter((item) => {
    if (item.region_id == "12" || item.region_id == "48") return false;
    return isGender
      ? item[`f_${indicatorYear}`] != null && item[`m_${indicatorYear}`] != null
      : item[`w_${indicatorYear}`] != null;
  });

  filteredData.sort((a, b) => {
    const aVal = isGender
      ? a[`f_${indicatorYear}`] + a[`m_${indicatorYear}`]
      : a[`w_${indicatorYear}`];
    const bVal = isGender
      ? b[`f_${indicatorYear}`] + b[`m_${indicatorYear}`]
      : b[`w_${indicatorYear}`];
    return bVal - aVal;
  });

  const headerRow = isGender
    ? [
        language === "en" ? "Region" : "რეგიონი",
        language === "en" ? "Female" : "ქალი",
        language === "en" ? "Male" : "კაცი",
      ]
    : [language === "en" ? "Region" : "რეგიონი", `${indicator} (${unit})`];

  const dataRows = isGender
    ? filteredData.map((item) => [
        item[`name_${language}`],
        formatValue(item[`f_${indicatorYear}`]),
        formatValue(item[`m_${indicatorYear}`]),
      ])
    : filteredData.map((item) => [
        item[`name_${language}`],
        formatValue(item[`w_${indicatorYear}`]),
      ]);

  autoTable(doc, {
    head: [headerRow],
    body: dataRows,
    startY: 20,
    theme: "grid",
    styles: {
      ...fontStyles,
    },
    headStyles: {
      fillColor: [47, 117, 181],
      textColor: 255,
      fontStyle: "bold",
      halign: "center", // 👈 Center header text horizontally
      valign: "middle", // (optional) vertical centering for taller rows
    },
    columnStyles: isGender
      ? {
          1: { halign: "center" }, // Female column
          2: { halign: "center" }, // Male column
        }
      : {
          1: { halign: "center" }, // Value column
        },
  });

  doc.save(`${indicator}(${indicatorYear}).pdf`);
};

export default downloadPDF;
