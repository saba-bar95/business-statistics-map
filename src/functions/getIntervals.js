import getIndicators from "./getIndicators";

const getIntervals = (language) => {
  return {
    [getIndicators(language)[0]]: {
      "1para": {
        num: 151,
        color: "#d8f2ed",
      },
      "2para": {
        num: [151, 700],
        color: "#9fc4be",
      },
      "3para": {
        num: [701, 1000],
        color: "#6b9993",
      },
      "4para": {
        num: [1001, 5000],
        color: "#3f736d",
      },
      "5para": {
        num: [5001],
        color: "#154f4a",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[1]]: {
      "1para": {
        num: 151,
        color: "#d7f0af",
      },
      "2para": {
        num: [151, 700],
        color: "#b5c989",
      },
      "3para": {
        num: [701, 1000],
        color: "#98a867",
      },
      "4para": {
        num: [1001, 5000],
        color: "#798748",
      },
      "5para": {
        num: [5001],
        color: "#606b2d",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[2]]: {
      "1para": {
        num: 3001,
        color: "#ffff80",
      },
      "2para": {
        num: [3001, 10000],
        color: "#fad155",
      },
      "3para": {
        num: [10000, 20000],
        color: "#f2a72e",
      },
      "4para": {
        num: [20001, 40000],
        color: "#ad5313",
      },
      "5para": {
        num: [40001],
        color: "#6b0000",
      },
      measurement_ge: "კაცი",
      measurement_en: "Person",
    },
    [getIndicators(language)[3]]: {
      "1para": {
        num: 3001,
        color: "#ffe0e0",
      },
      "2para": {
        num: [3001, 10000],
        color: "#eba59b",
      },
      "3para": {
        num: [10000, 20000],
        color: "#cf705f",
      },
      "4para": {
        num: [20001, 40000],
        color: "#b04130",
      },
      "5para": {
        num: [40001],
        color: "#8f0a0a",
      },
      measurement_ge: "კაცი",
      measurement_en: "Person",
    },
    [getIndicators(language)[4]]: {
      "1para": {
        num: 151,
        color: "#f0ecaa",
      },
      "2para": {
        num: [151, 700],
        color: "#c9bc87",
      },
      "3para": {
        num: [701, 1000],
        color: "#a69165",
      },
      "4para": {
        num: [1001, 5000],
        color: "#856b49",
      },
      "5para": {
        num: [5001],
        color: "#664830",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[5]]: {
      "1para": {
        num: 51,
        color: "#bee8ff",
      },
      "2para": {
        num: [51, 100],
        color: "#95bee8",
      },
      "3para": {
        num: [101, 200],
        color: "#6baad1",
      },
      "4para": {
        num: [201, 300],
        color: "#4296bd",
      },
      "5para": {
        num: [301],
        color: "#004da8",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[6]]: {
      "1para": {
        num: 151,
        color: "#ffbfbf",
      },
      "2para": {
        num: [151, 700],
        color: "#e0a49d",
      },
      "3para": {
        num: [701, 1000],
        color: "#c2897c",
      },
      "4para": {
        num: [1001, 5000],
        color: "#a67260",
      },
      "5para": {
        num: [5001],
        color: "#442e23",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[7]]: {
      "1para": {
        num: 151,
        color: "#ffbfbf",
      },
      "2para": {
        num: [151, 700],
        color: "#e8bac5",
      },
      "3para": {
        num: [701, 1000],
        color: "#cfb4cb",
      },
      "4para": {
        num: [1001, 5000],
        color: "#b7b0d1",
      },
      "5para": {
        num: [5001],
        color: "#9ca9d6",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "GEL",
    },
    [getIndicators(language)[8]]: {
      "1para": {
        num: 101,
        color: "#e5d5f2",
      },
      "2para": {
        num: [101, 300],
        color: "#bfa3cf",
      },
      "3para": {
        num: [301, 500],
        color: "#9d78ad",
      },
      "4para": {
        num: [501, 700],
        color: "#7b4f8c",
      },
      "5para": {
        num: [701],
        color: "#5d2c70",
      },
      measurement_ge: "ლარი",
      measurement_en: "GEL",
    },
    [getIndicators(language)[9]]: {
      "1para": {
        num: 101,
        color: "#709959",
      },
      "2para": {
        num: [101, 200],
        color: "#f2eea2",
      },
      "3para": {
        num: [201, 400],
        color: "#f2ce85",
      },
      "4para": {
        num: [401, 600],
        color: "#c28c7c",
      },
      "5para": {
        num: [601],
        color: "#d7c29e",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[10]]: {
      "1para": {
        num: 101,
        color: "#dcf5e9",
      },
      "2para": {
        num: [101, 200],
        color: "#a7cfb4",
      },
      "3para": {
        num: [201, 400],
        color: "#76a882",
      },
      "4para": {
        num: [401, 700],
        color: "#4a8758",
      },
      "5para": {
        num: [701],
        color: "#226633",
      },
      measurement_ge: "მლნ. ლარი",
      measurement_en: "Million GEL",
    },
    [getIndicators(language)[11]]: {
      "1para": {
        num: 3001,
        color: "#ffe0e0",
      },
      "2para": {
        num: [3001, 20000],
        color: "#eba59b",
      },
      "3para": {
        num: [20000, 50000],
        color: "#cf705f",
      },
      "4para": {
        num: [50001, 100000],
        color: "#b04130",
      },
      "5para": {
        num: [100001],
        color: "#8f0a0a",
      },
      measurement_ge: "კაცი",
      measurement_en: "men",
    },
    [getIndicators(language)[12]]: {
      "1para": {
        num: 601,
        color: "#e5d5f2",
      },
      "2para": {
        num: [601, 800],
        color: "#bfa3cf",
      },
      "3para": {
        num: [801, 1000],
        color: "#9d78ad",
      },
      "4para": {
        num: [1001, 1500],
        color: "#7b4f8c",
      },
      "5para": {
        num: [1501],
        color: "#5d2c70",
      },
      measurement_ge: "ლარი",
      measurement_en: "GEL",
    },
  };
};
export default getIntervals;
