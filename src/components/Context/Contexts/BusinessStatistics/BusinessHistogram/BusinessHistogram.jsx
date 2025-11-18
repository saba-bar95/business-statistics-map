import YearsSelect from "../YearsSelect";
import IndicatorsSelect from "../IndicatorsSelect";
import RegionSelect from "../RegionSelect";
import { useContext, useState, useEffect } from "react";
import { QueriesContext } from "../../../../../App";
import { useParams } from "react-router";
import Download from "../BusinessDiagram/Download/Download";
import BarChart from "./BarChart";
import BarChartGenders from "./BarChartGenders";

const BusinessHistogram = () => {
  const {
    selectedQuery,
    indicator,
    indicators,
    indicatorInfo,
    yearlyRegionData,
    selectedRegion,
  } = useContext(QueriesContext);

  const { language } = useParams();
  const isGender = indicator === indicators[11] || indicator === indicators[12];

  // Track window width for responsive gap
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive gap: 0 if < 900px, otherwise 20px
  const responsiveGap = windowWidth < 1201 ? "10px" : "20px";
  const responsiveWidth = windowWidth < 1201 ? "100%" : "100%";
  const flexDirection = windowWidth < 1201 ? "column" : "row";

  return (
    <div className="business-indicator">
      <div
        className="container"
        style={{ position: "relative", width: "100%" }}>
        <IndicatorsSelect />
      </div>

      <div
        className="container"
        style={{
          display: "flex",
          gap: responsiveGap,
          flexDirection: flexDirection,
          width: responsiveWidth,
          justifyContent: "space-between",
        }}>
        <RegionSelect />
        <YearsSelect />
      </div>

      <div className="diagram-header">
        <p className="diagram-p">
          {selectedQuery[`title_${language}`]}: {indicator}
          {indicatorInfo[`measurement_${language}`] && (
            <> ({indicatorInfo[`measurement_${language}`]})</>
          )}
        </p>
        <p className="diagram-p">
          {language === "en" ? "Region:" : "რეგიონი:"} {selectedRegion}
        </p>
        <Download isHistogram={true} />
      </div>

      {!isGender ? (
        <BarChart data={yearlyRegionData} />
      ) : (
        <BarChartGenders data={yearlyRegionData} />
      )}
    </div>
  );
};

export default BusinessHistogram;
