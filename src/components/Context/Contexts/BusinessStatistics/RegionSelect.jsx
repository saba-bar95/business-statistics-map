import { useContext } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../App";

const RegionSelect = () => {
  const { language } = useParams();
  const { regData, selectedRegionID, setSelectedRegionID, setSelectedRegion } =
    useContext(QueriesContext);

  const handleRegionChange = (e) => {
    const selectedValue = e.target.value;
    const selectedText = e.target.options[e.target.selectedIndex].text;

    setSelectedRegionID(selectedValue);
    setSelectedRegion(selectedText); // ✅ Set the region name here
  };

  return (
    <select
      name="regionSelect"
      id="region"
      value={selectedRegionID ?? ""}
      onChange={handleRegionChange}>
      {regData
        .filter((reg) => reg.region_id != "12" && reg.region_id != "48")
        .sort((a, b) => Number(a.region_id) - Number(b.region_id))
        .map((reg) => (
          <option key={reg.region_id} value={reg.region_id}>
            {reg[`name_${language}`]}
          </option>
        ))}
    </select>
  );
};

export default RegionSelect;
