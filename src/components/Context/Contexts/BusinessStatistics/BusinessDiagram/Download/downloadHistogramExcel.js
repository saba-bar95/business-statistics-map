import * as XLSX from "xlsx";

const downloadHistogramExcel = (
  language,
  yearlyRegionData,
  indicatorYear,
  indicator,
  unit,
  isGender,
  isEmployees,
  selectedRegion
) => {
  const yearHeader = language === "en" ? "Year" : "წელი";
  const indicatorHeader = `${indicator} (${unit})`;
  const maleHeader = language === "en" ? "Male" : "მამაკაცი";
  const femaleHeader = language === "en" ? "Female" : "ქალი";

  let sheetData;

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

  if (isGender) {
    // Gender-disaggregated format with merged headers
    sheetData = [
      [yearHeader, indicatorHeader, ""], // Row 1
      ["", maleHeader, femaleHeader], // Row 2
      ...yearlyRegionData.map((item) => [
        item.year,
        formatValue(item.maleNumber),
        formatValue(item.femaleNumber),
      ]),
    ];
  } else {
    // Standard format
    sheetData = [
      [yearHeader, indicatorHeader],
      ...yearlyRegionData.map((item) => [item.year, formatValue(item.number)]),
    ];
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Add merge for indicatorHeader across columns B and C
  if (isGender) {
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 1 }, // start at row 0, column 1 (B1)
        e: { r: 0, c: 2 }, // end at row 0, column 2 (C1)
      },
    ];
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Histogram");

  const regionName = selectedRegion || "Region";
  const fileName =
    language === "en"
      ? `${indicator}(${regionName})_from_${indicatorYear}.xlsx`
      : `${indicator}(${regionName})_${indicatorYear}_დან.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

export default downloadHistogramExcel;
