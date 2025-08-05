import "./App.scss";
import MapComponent from "./components/MapComponent/MapComponent";
import Navigation from "./components/Navigation/Navigation";
import queries from "./components/Navigation/queries";
import { useState, createContext, useEffect, useMemo } from "react";
import ColorBox from "./components/ColorBox/ColorBox";
import LanguageChanger from "./components/LanguageChanger/LanguageChanger";
import { useParams } from "react-router";
import getIndicators from "./functions/getIndicators";
import getIntervals from "./functions/getIntervals";
import fetchData from "./functions/fetchData";
import fetchPayGender from "./functions/fetchPayGender";
import fetchRegionData from "./functions/fetchRegionData";
import fetchRegionGenderData from "./functions/fetchRegionGenderData";
import fetchCompaniesData from "./functions/fetchCompaniesData";
import fetchLegalForms from "./functions/fetchLegalForms";

export const QueriesContext = createContext();

function App() {
  const { language } = useParams();
  const [selectedQuery, setSelectedQuery] = useState(queries[0]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [regData, setRegData] = useState(null);
  const [munData, setMunData] = useState(null);
  const [indicatorYear, setIndicatorYear] = useState(2022);
  const [indicators, setIndicators] = useState(() => getIndicators(language));
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const [indicator, setIndicator] = useState(
    () => getIndicators(language)[indicatorIndex]
  );
  const [indicatorInfo, setIndicatorInfo] = useState(
    () => getIntervals(language)[getIndicators(language)[indicatorIndex]]
  );
  const [selectedRegionID, setSelectedRegionID] = useState(11);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [yearlyRegionData, setYearlyRegionData] = useState([]);
  const [selectedFindRegionID, setSelectedFindRegionId] = useState("");
  const [legalForms, setLegalForms] = useState("");
  const [selectedFormID, setSelectedFormID] = useState("");
  const [companiesData, setCompaniesData] = useState(null);

  useEffect(() => {
    if (regData && selectedRegionID) {
      const region = regData.find((reg) => reg.region_id == selectedRegionID);
      if (region) {
        setSelectedRegion(region[`name_${language}`]);
      }
    }
  }, [regData, selectedRegionID, language]);

  const indicatorMap = useMemo(
    () => ({
      [indicators[0]]: "Brunva",
      [indicators[1]]: "ValAdded",
      [indicators[2]]: "Employed",
      [indicators[3]]: "Employees",
      [indicators[4]]: "Resale",
      [indicators[5]]: "Investment",
      [indicators[6]]: "ProdVal",
      [indicators[7]]: "Purchases",
      [indicators[8]]: "Remuneration",
      [indicators[9]]: "Costs",
      [indicators[10]]: "IntConsumption",
      [indicators[11]]: "RegEmployeesGender",
      [indicators[12]]: "PayGender",
    }),
    [indicators]
  );

  const fetchYears = async (
    fetchFn,
    indicator,
    regionID,
    startYear,
    endYear,
    formatter
  ) => {
    const results = [];
    for (let year = startYear; year <= endYear; year++) {
      try {
        const data = await fetchFn(indicator, regionID, year);
        if (!data) throw new Error(`No data for year ${year}`);
        results.push(formatter(data, year));
      } catch (error) {
        console.log(`Error fetching data for year ${year}:`, error.message);
      }
    }
    return results;
  };

  const formatSingleData = (data, year) => ({
    year,
    number: data[`w_${year}`],
  });

  const formatGenderData = (data, year) => ({
    year,
    maleNumber: data[`m_${year}`],
    femaleNumber: data[`f_${year}`],
  });

  useEffect(() => {
    if (!selectedRegionID || !indicatorYear) return;

    const fetchData = async () => {
      const indicatorKey = indicatorMap[indicator];
      const isGender =
        indicator === indicators[11] || indicator === indicators[12];
      const fetchFn = isGender ? fetchRegionGenderData : fetchRegionData;
      const formatter = isGender ? formatGenderData : formatSingleData;
      const usedIndicator = isGender
        ? indicator === indicators[11]
          ? "EmployeesGender"
          : "PayGender"
        : indicatorKey;

      const dataArray = await fetchYears(
        fetchFn,
        usedIndicator,
        selectedRegionID,
        indicatorYear,
        2022,
        formatter
      );

      setYearlyRegionData(dataArray);
    };

    fetchData();
  }, [selectedRegionID, indicatorYear, indicator, indicatorMap, indicators]);

  useEffect(() => {
    const newIndicators = getIndicators(language);
    setIndicators(newIndicators);
    const clampedIndex = Math.min(indicatorIndex, newIndicators.length - 1);
    setIndicator(newIndicators[clampedIndex]);
    setIndicatorInfo(getIntervals(language)[newIndicators[clampedIndex]]);
  }, [language, indicatorIndex]);

  const handleSelectQuery = (el) => {
    setSelectedQuery(el);
  };

  const handleSelectLink = (el) => {
    setSelectedLink(el);
  };

  const closeSidebar = () => {
    setSelectedLink(null);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const [regDataRes, munDataRes] = await Promise.all([
        fetchData("Brunva", "Reg", 2022),
        fetchData("Brunva", "Mun", 2022),
      ]);

      if (regDataRes) setRegData(regDataRes);
      if (munDataRes) setMunData(munDataRes);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const runFetch = async () => {
      const indicatorKey = indicatorMap[indicator];
      if (!indicatorKey) return;

      if (indicator === indicators[12] || indicator === indicators[11]) {
        const regDataRes = await fetchPayGender(indicatorKey, indicatorYear);
        if (regDataRes) setRegData(regDataRes);
        setMunData(null);
        return;
      }

      const shouldFetchMun = indicatorYear > 2013;
      const regScale = indicator === indicators[1] ? "" : "Reg";

      const [regRes, munRes] = await Promise.all([
        fetchData(indicatorKey, regScale, indicatorYear),
        shouldFetchMun ? fetchData(indicatorKey, "Mun", indicatorYear) : null,
      ]);

      if (regRes) setRegData(regRes);
      if (munRes) setMunData(munRes);
    };

    runFetch();
  }, [
    indicatorYear,
    indicator,
    indicatorMap,
    indicators,
    setRegData,
    setMunData,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLegalForms(language);
        if (data) setLegalForms(data);
      } catch (err) {
        console.error("Error fetching legal forms:", err);
      }
    };

    fetchData();
  }, [language, setLegalForms]);

  useEffect(() => {
    if (!selectedFindRegionID || selectedFindRegionID === 0) return;

    setCompaniesData(null);
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        const data = await fetchCompaniesData(
          selectedFindRegionID,
          selectedFormID,
          signal
        );
        if (data) {
          console.log(data);
          setCompaniesData(data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [selectedFindRegionID, selectedFormID]);

  return (
    <QueriesContext.Provider
      value={{
        selectedQuery,
        selectedLink,
        indicatorYear,
        closeSidebar,
        regData,
        munData,
        setRegData,
        setMunData,
        setIndicatorYear,
        handleSelectLink,
        handleSelectQuery,
        indicators,
        indicator,
        indicatorInfo,
        setIndicator,
        setIndicatorIndex,
        selectedRegionID,
        setSelectedRegionID,
        yearlyRegionData,
        selectedRegion,
        setSelectedRegion,
        selectedFindRegionID,
        setSelectedFindRegionId,
        legalForms,
        setLegalForms,
        setSelectedFormID,
        companiesData,
      }}>
      <div className="app-container">
        <Navigation />
        <div className="map-container">
          <MapComponent />
        </div>
        <ColorBox />
        <LanguageChanger />
      </div>
    </QueriesContext.Provider>
  );
}

export default App;
