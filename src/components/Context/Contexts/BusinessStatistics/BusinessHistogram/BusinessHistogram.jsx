import YearsSelect from "../YearsSelect";
import IndicatorsSelect from "../IndicatorsSelect";
import RegionSelect from "../RegionSelect";
import { useContext } from "react";
import { QueriesContext } from "../../../../../App";
import { useParams } from "react-router";

const BusinessHistogram = () => {
  const {
    selectedQuery,
    indicator,
    indicatorInfo,
    indicatorYear,
    yearlyRegionData,
  } = useContext(QueriesContext);

  const { language } = useParams();

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
          gap: "20px",
          width: "100%",
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
          {language === "en" ? "Year" : "წელი"}{" "}
          <span className="diagram-span">{indicatorYear}</span>
        </p>
      </div>
    </div>
  );
};

export default BusinessHistogram;
