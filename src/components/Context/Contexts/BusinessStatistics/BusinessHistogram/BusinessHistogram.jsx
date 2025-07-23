import YearsSelect from "../YearsSelect";
import IndicatorsSelect from "../IndicatorsSelect";
import RegionSelect from "../RegionSelect";
import { useContext } from "react";
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
  } = useContext(QueriesContext);

  const { language } = useParams();
  const isGender = indicator === indicators[11] || indicator === indicators[12];

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
