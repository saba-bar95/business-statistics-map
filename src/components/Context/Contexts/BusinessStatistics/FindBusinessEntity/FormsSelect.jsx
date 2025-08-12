import { useContext } from "react";
import { useParams } from "react-router";
import { QueriesContext } from "../../../../../App";

const FormsSelect = () => {
  const { language } = useParams();

  const { legalForms, setSelectedFormID } = useContext(QueriesContext);

  const handleFormChange = (e) => {
    setSelectedFormID(+e.target.value);
  };

  const text = language === "en" ? "Select Region" : "აირჩიეთ იურიდიული ფორმა";

  return (
    <select
      style={{ width: "100%" }}
      name="formSelect"
      id="form"
      onChange={handleFormChange}>
      <option>{text}</option>
      {legalForms &&
        legalForms.map((el) => (
          <option key={el.ID} value={el.ID}>
            {el.Legal_Form}
          </option>
        ))}
    </select>
  );
};

export default FormsSelect;
