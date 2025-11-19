import "./BusinessIndicator.scss";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../../App";
import AngleRight from "./AngleRight";
import AngleDown from "./AngleDown";
import municipalities from "../../../../../coordinates/municipalities";
import YearsSelect from "../YearsSelect";
import IndicatorsSelect from "../IndicatorsSelect";

const BusinessIndicator = () => {
  const {
    regData,
    munData,
    indicators,
    indicator,
    indicatorInfo,
    indicatorYear,
  } = useContext(QueriesContext);

  const { language } = useParams();
  const [isMunOpen, setIsMunOpen] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  // Reset open municipality when indicator changes
  useEffect(() => {
    setIsMunOpen(null);
    setSelectedRegionId(null);
  }, [indicator]);

  let sortedMuns;
  const isByGender =
    indicator === indicators[12] || indicator === indicators[11];

  const sortedByGender =
    regData &&
    regData
      .filter(
        (region) =>
          region[`f_${indicatorYear}`] !== 0 &&
          region[`f_${indicatorYear}`] !== null
      )
      .sort((a, b) => b[`f_${indicatorYear}`] - a[`f_${indicatorYear}`]);

  const sortedRegions =
    regData &&
    regData
      .filter((region) => region[`w_${indicatorYear}`] !== null) // Exclude regions with null values
      .sort((a, b) => b[`w_${indicatorYear}`] - a[`w_${indicatorYear}`]); // Sort in descending order

  return (
    <div className="business-indicator">
      <div className="container">
        <IndicatorsSelect />
      </div>
      <div className="container">
        <YearsSelect />
      </div>

      {isByGender && (
        <div className="container regions-container">
          <div className="header header-gender">
            <p>{language === "en" ? "Region" : "რეგიონი"}</p>
            <div className="genders">
              <p>{language === "en" ? "Female" : "ქალი"}</p>
              <p>{language === "en" ? "Male" : "კაცი"}</p>
            </div>
          </div>
          <div className="regions">
            {sortedByGender.map((region) => {
              const regId = region.region_id;
              if (regId === 12) return null;
              return (
                <div className="paras" key={regId}>
                  <p>{region[`name_${language}`]}</p>
                  <div className="numbers">
                    <p>
                      {typeof region[`f_${indicatorYear}`] === "number"
                        ? indicator === indicators[11]
                          ? Math.floor(region[`f_${indicatorYear}`])
                          : region[`f_${indicatorYear}`].toFixed(1)
                        : region[`f_${indicatorYear}`]}
                    </p>
                    <p>
                      {typeof region[`m_${indicatorYear}`] === "number"
                        ? indicator === indicators[11]
                          ? Math.floor(region[`m_${indicatorYear}`])
                          : region[`m_${indicatorYear}`].toFixed(1)
                        : region[`m_${indicatorYear}`]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isByGender && (
        <div className="container regions-container">
          <div className="header">
            <p>{language === "en" ? "Region" : "რეგიონი"}</p>
            <p>{indicatorInfo && indicatorInfo[`measurement_${language}`]}</p>
          </div>
          <div className="regions">
            {sortedRegions &&
              sortedRegions.map((region) => {
                const regId = region.region_id;
                if (munData) {
                  const muns =
                    munData &&
                    munData.filter((mun) => {
                      const munId = mun.municipal_
                        ? mun.municipal_.slice(0, 2)
                        : 0;
                      return munId === regId;
                    });
                  sortedMuns =
                    muns &&
                    muns
                      .filter((mun) => mun[`w_${indicatorYear}`] !== null)
                      .sort(
                        (a, b) =>
                          b[`w_${indicatorYear}`] - a[`w_${indicatorYear}`]
                      );
                }

                return (
                  <div className="wrapper" key={regId}>
                    <div
                      className={"paras"} // Add conditional class here
                      onClick={() => {
                        if (regId === selectedRegionId)
                          setSelectedRegionId(null);
                        else setSelectedRegionId(regId); // Set the selected region ID
                        setIsMunOpen((prev) => (prev === regId ? null : regId));
                      }}
                      style={
                        indicatorYear > 2013 && regId === "11"
                          ? { marginLeft: "23px" }
                          : undefined
                      }
                    >
                      {region[`w_${indicatorYear}`] > 0 && (
                        <>
                          <p>
                            {regId === "11" ? null : selectedRegionId ===
                              regId ? (
                              <>{indicatorYear > 2013 && <AngleDown />}</>
                            ) : (
                              <>{indicatorYear > 2013 && <AngleRight />}</>
                            )}
                            {region[`name_${language}`]}
                          </p>
                          <p>
                            {typeof region[`w_${indicatorYear}`] === "number"
                              ? region[`w_${indicatorYear}`].toFixed(1)
                              : region[`w_${indicatorYear}`]}
                          </p>
                        </>
                      )}
                    </div>
                    {isMunOpen &&
                      indicatorYear > 2013 &&
                      selectedRegionId === regId &&
                      regId !== "11" && (
                        <div className="mun-container">
                          {sortedMuns &&
                            sortedMuns
                              .sort((a, b) => b.value - a.value)
                              .map((mun) => {
                                const name = municipalities.features
                                  .filter(
                                    (mun1) =>
                                      mun1.properties.MUNICIPAL1 ===
                                      mun.municipal_
                                  )
                                  .map((mun2) =>
                                    language === "en"
                                      ? mun2.properties.NAME_EN
                                      : mun2.properties.NAME_SYLFA
                                  );

                                return (
                                  <div
                                    className="mun-paras"
                                    key={mun.municipal_}
                                  >
                                    <p>{name}</p>
                                    <p>
                                      {typeof mun[`w_${indicatorYear}`] ===
                                      "number"
                                        ? mun[`w_${indicatorYear}`].toFixed(1)
                                        : typeof mun.value === "number"
                                        ? mun.value.toFixed(1)
                                        : "N/A"}
                                    </p>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessIndicator;
