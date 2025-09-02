import { useContext } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../../App";

const RegionSelect = () => {
  const { language } = useParams();
  const { regData, selectedFindRegionID, setSelectedFindRegionId } =
    useContext(QueriesContext);

  const handleRegionChange = (e) => {
    const selectedValue = +e.target.value;

    if (isNaN(selectedValue)) {
      setSelectedFindRegionId(null);
    } else {
      setSelectedFindRegionId(selectedValue);
    }
  };

  const text = language === "en" ? "Select Region" : "აირჩიეთ რეგიონი";
  const georgia = language === "en" ? "* Georgia" : "* საქართველო";

  return (
    <select
      style={{ width: "100%" }}
      name="regionSelect"
      id="region"
      value={selectedFindRegionID ?? ""}
      onChange={handleRegionChange}>
      <option>{text}</option>
      {regData
        .filter((reg) => reg.region_id != "12" && reg.region_id != "48")
        .sort((a, b) => Number(a.region_id) - Number(b.region_id))
        .map((reg) => (
          <option key={reg.region_id} value={reg.region_id}>
            {reg[`name_${language}`]}
          </option>
        ))}
      <option value={100}>{georgia}</option>
    </select>
  );
};

export default RegionSelect;
