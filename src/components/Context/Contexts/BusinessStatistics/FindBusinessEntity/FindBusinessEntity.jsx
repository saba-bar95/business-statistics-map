import RegionSelect from "./RegionSelect";
import FormsSelect from "./FormsSelect";

const FindBusinessEntity = () => {
  return (
    <div className="business-indicator">
      <div
        className="container"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}>
        <RegionSelect />
        <FormsSelect />
      </div>
    </div>
  );
};

export default FindBusinessEntity;
