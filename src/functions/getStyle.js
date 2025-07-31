const getStyle = (feature, zoomLevel, type, color) => {
  const id = +feature.id;

  if (zoomLevel > 8 && type === "municipality") {
    return {
      color: "gray",
      weight: 2,
      fillOpacity: 0.3,
      fillColor: color,
    };
  }

  if (zoomLevel > 8 && type === "region") {
    if (id === 48 || id === 12) {
      return {
        color: "transparent",
        weight: 3,
        fillColor: "rgba(255, 0, 0, 0.5)",
        fillOpacity: 0.5,
      };
    }
    return {
      color: "#191970",
      fillColor: "#78716c",
      weight: 4,
      fillOpacity: 0,
    };
  }

  if (zoomLevel <= 8 && type === "region") {
    if (id === 48 || id === 12) {
      return {
        color: "transparent",
        weight: 3,
        fillColor: "rgba(255, 0, 0, 0.5)",
        fillOpacity: 0.5,
        dashArray: "5, 5",
      };
    }
    return {
      color: "#78716c",
      weight: 3,
      fillColor: color,
      fillOpacity: 0.5,
    };
  }
};

export default getStyle;
