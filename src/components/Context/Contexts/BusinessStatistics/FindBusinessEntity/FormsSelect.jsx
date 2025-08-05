import { useContext } from "react";
import { QueriesContext } from "../../../../../App";

const FormsSelect = () => {
  const { legalForms, setSelectedFormID } = useContext(QueriesContext);

  const handleFormChange = (e) => {
    setSelectedFormID(+e.target.value);
  };

  return (
    <select
      style={{ width: "100%" }}
      name="formSelect"
      id="form"
      onChange={handleFormChange}>
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
