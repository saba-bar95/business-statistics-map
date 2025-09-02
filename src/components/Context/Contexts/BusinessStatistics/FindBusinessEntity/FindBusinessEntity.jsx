import RegionSelect from "./RegionSelect";
import FormsSelect from "./FormsSelect";
import ActivitySelect from "./ActivitySelect";

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
        <ActivitySelect />
      </div>
    </div>
  );
};

export default FindBusinessEntity;
