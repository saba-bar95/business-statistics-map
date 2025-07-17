import { useContext } from "react";
import { QueriesContext } from "../../../../App";

const IndicatorsSelect = () => {
  const {
    indicators,
    indicator,
    indicatorYear,
    setIndicatorYear,
    setIndicatorIndex,
    setIndicator,
  } = useContext(QueriesContext);

  const years = Array.from({ length: 24 }, (_, i) => 2022 - i);

  const indicatorYearLimits = {
    5: 2007,
    4: 2007,
    7: 2007,
    11: 2007,
    12: 2007,
    10: 2006,
    9: 2006,
    1: 2006,
    2: 2006,
  };

  const getMinValidYear = (ind) =>
    indicatorYearLimits[indicators.indexOf(ind)] || Math.min(...years);

  const handleIndicatorChange = (e) => {
    const selected = e.target.value;
    const index = indicators.indexOf(selected);

    setIndicatorIndex(index);
    setIndicator(selected);

    const minYear = getMinValidYear(selected);
    if (indicatorYear < minYear) setIndicatorYear(minYear);
  };

  return (
    <select
      style={{ width: "100%" }}
      value={indicator}
      name="indicatorSelect"
      id="indicator"
      onChange={handleIndicatorChange}>
      {indicators.map((el) => (
        <option key={el}>{el}</option>
      ))}
    </select>
  );
};

export default IndicatorsSelect;
