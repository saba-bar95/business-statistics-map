import * as XLSX from "xlsx";

const downloadExcel = (
  language,
  regData,
  indicatorYear,
  indicator,
  unit,
  isGender,
  isEmployees
) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const formatValue = (value) => {
    if (isEmployees) {
      return Math.floor(value);
    } else {
      return formatter.format(value);
    }
  };

  // 🧼 Filter valid rows
  const filteredData = regData.filter((item) => {
    if (item.region_id == "12" || item.region_id == "48") return false;
    return isGender
      ? item[`f_${indicatorYear}`] != null && item[`m_${indicatorYear}`] != null
      : item[`w_${indicatorYear}`] != null;
  });

  // 🔢 Sort descending by total value
  filteredData.sort((a, b) => {
    const aVal = isGender
      ? a[`f_${indicatorYear}`] + a[`m_${indicatorYear}`]
      : a[`w_${indicatorYear}`];
    const bVal = isGender
      ? b[`f_${indicatorYear}`] + b[`m_${indicatorYear}`]
      : b[`w_${indicatorYear}`];
    return bVal - aVal;
  });

  // 📋 Build sheet content
  const sheetData = isGender
    ? [
        [
          language === "en" ? "Region" : "რეგიონი",
          language === "en" ? "Female" : "ქალი",
          language === "en" ? "Male" : "კაცი",
        ],
        ...filteredData.map((item) => [
          item[`name_${language}`],
          formatValue(item[`f_${indicatorYear}`]),
          formatValue(item[`m_${indicatorYear}`]),
        ]),
      ]
    : [
        [language === "en" ? "Region" : "რეგიონი", `${indicator} (${unit})`],
        ...filteredData.map((item) => [
          item[`name_${language}`],
          formatValue(item[`w_${indicatorYear}`]),
        ]),
      ];

  // 🧵 Create and style worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [sheetData[0]], { origin: "A1" });
  XLSX.utils.sheet_add_aoa(worksheet, sheetData.slice(1), { origin: "A2" });

  // 📦 Build and export file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${indicator}(${indicatorYear}).xlsx`);
};

export default downloadExcel;
