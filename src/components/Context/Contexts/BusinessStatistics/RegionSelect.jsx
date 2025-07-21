import { useContext } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../App";

const RegionSelect = () => {
  const { language } = useParams();
  const { regData, selectedRegionID, setSelectedRegionID } =
    useContext(QueriesContext);

  const handleRegionChange = (e) => {
    setSelectedRegionID(e.target.value);
  };

  return (
    <select
      name="regionSelect"
      id="region"
      value={selectedRegionID ?? ""}
      onChange={handleRegionChange}>
      {regData
        .filter((reg) => reg.region_id != "12" && reg.region_id != "48")
        .sort((a, b) => Number(a.region_id) - Number(b.region_id)) // 🔽 Descending sort
        .map((reg) => (
          <option key={reg.region_id} value={reg.region_id}>
            {reg[`name_${language}`]}
          </option>
        ))}
    </select>
  );
};

export default RegionSelect;
