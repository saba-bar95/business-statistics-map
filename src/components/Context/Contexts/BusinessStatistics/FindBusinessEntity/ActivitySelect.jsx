import { useContext } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../../App";

const ActivitySelect = () => {
  const { language } = useParams();

  const { activities, setSelectedActivityID } = useContext(QueriesContext);

  const handleActivityChange = (e) => {
    const selectedValue = +e.target.value;

    if (isNaN(selectedValue)) {
      setSelectedActivityID(null);
    } else {
      setSelectedActivityID(selectedValue);
    }
  };

  const text =
    language === "en"
      ? "Select the type of activity"
      : "აირჩიეთ საქმიანობის სახე";

  const capitalizeFirstWord = (str) => {
    if (language === "ge") return str;
    if (!str) return "";
    const words = str.toLowerCase().split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  };

  return (
    <select
      style={{ width: "100%", maxWidth: "320px" }}
      name="formSelect"
      id="form"
      onChange={handleActivityChange}>
      <option>{text}</option>
      {activities &&
        activities.map((el) =>
          el.ID !== 1690 ? (
            <option key={el.ID} value={el.ID} style={{ textTransform: "none" }}>
              {capitalizeFirstWord(el.Activity_Name)}
            </option>
          ) : null
        )}
    </select>
  );
};

export default ActivitySelect;
