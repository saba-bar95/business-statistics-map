import { useParams } from "react-router";
import { useState, useContext } from "react";
import { QueriesContext } from "../../../../../../App";
import "./Download.scss";
import downloadExcel from "./downloadExcel";
import downloadPDF from "./downloadPDF";
import downloadJPG from "./downloadJPG";

const Download = () => {
  const formats = ["jpg", "pdf", "xlsx"];
  const [showWrapper, setShowWrapper] = useState(false);
  const { language } = useParams();

  const { regData, indicator, indicators, indicatorYear, indicatorInfo } =
    useContext(QueriesContext);

  const unit = indicatorInfo[`measurement_${language}`];
  const isGender = indicator === indicators[11] || indicator === indicators[12];
  const isEmployees = indicator === indicators[11];

  const handleDownload = (event, format) => {
    switch (format) {
      case "jpg":
        downloadJPG(event);
        break;
      case "pdf":
        downloadPDF(
          language,
          regData,
          indicatorYear,
          indicator,
          unit,
          isGender,
          isEmployees
        );
        break;
      case "xlsx":
        downloadExcel(
          language,
          regData,
          indicatorYear,
          indicator,
          unit,
          isGender,
          isEmployees
        );
        break;
      default:
        console.warn("Unknown format:", format);
    }
  };

  return (
    <div className="download-container">
      <div className="dropdown-container">
        {showWrapper && (
          <div
            className="wrapper"
            onMouseEnter={() => setShowWrapper(true)}
            onMouseLeave={() => setShowWrapper(false)}>
            {formats.map((el) => (
              <div key={el} onClick={(event) => handleDownload(event, el)}>
                <p>{el}</p>
              </div>
            ))}
          </div>
        )}
        <div
          className="download"
          onMouseEnter={() => setShowWrapper(true)}
          onMouseLeave={() => setShowWrapper(false)}>
          <h1>{language === "en" ? "Download" : "გადმოწერა"}</h1>
        </div>
      </div>
      <div className="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px">
          <path d="M3,0 L8,0 L8,5 L11,5 L5.5,10 L0,5 L3,5 L03,0" fill="#888" />
          <rect x="0" y="12" width="11" height="2" fill="#888" />
        </svg>
      </div>
    </div>
  );
};

export default Download;
