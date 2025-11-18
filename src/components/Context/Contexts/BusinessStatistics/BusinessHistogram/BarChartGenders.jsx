/* eslint-disable react/prop-types */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useState, useEffect } from "react";
import { useParams } from "react-router";

const BarChartGenders = ({ data }) => {
  const { language } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const maleText = language === "en" ? "Male" : "კაცი";
  const femaleText = language === "en" ? "Female" : "ქალი";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedData = data.map((item) => ({
    ...item,
    year: String(item.year),
  }));

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // THIS IS THE MAGIC: forces all numbers to show with comma + exactly 1 decimal
    root.numberFormatter.set("numberFormat", "#,###.0");

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 60,
        layout: root.verticalLayout,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      inversed: true,
    });
    yRenderer.grid.template.set("visible", false);

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: yRenderer,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, { strokeOpacity: 0.1 }),
      })
    );

    const axisFontSize = windowWidth < 769 ? 11 : windowWidth < 1201 ? 12 : 13;
    yRenderer.labels.template.setAll({
      fontSize: axisFontSize,
      fontFamily: "Verdana",
    });
    xAxis
      .get("renderer")
      .labels.template.setAll({
        fontSize: axisFontSize,
        fontFamily: "Verdana",
      });

    const createTooltip = () => {
      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        autoTextColor: false,
      });

      tooltip.get("background")?.setAll({
        fill: am5.color("#1a1a1a"),
        fillOpacity: 0.95,
        stroke: am5.color("#444444"),
        strokeWidth: 1,
        strokeOpacity: 0.6,
        cornerRadius: 8,
      });

      const tooltipFontSize =
        windowWidth < 769 ? 10 : windowWidth < 1201 ? 13 : 14;
      const paddingV = windowWidth < 769 ? 4 : windowWidth < 1201 ? 6 : 8;
      const paddingH = windowWidth < 769 ? 8 : windowWidth < 1201 ? 10 : 12;

      tooltip.label.setAll({
        fill: am5.color("#ffffff"),
        fontSize: tooltipFontSize,
        fontWeight: "600",
        fontFamily: "Verdana",
      });

      tooltip.setAll({
        paddingTop: paddingV,
        paddingBottom: paddingV,
        paddingLeft: paddingH,
        paddingRight: paddingH,
      });

      return tooltip;
    };

    // Male Series
    const maleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: maleText,
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "maleNumber",
        categoryYField: "year",
        clustered: true,
      })
    );

    maleSeries.columns.template.setAll({
      fill: am5.color(0x4e79a7),
      strokeOpacity: 0,
      cornerRadiusTR: 6,
      cornerRadiusBR: 6,
    });

    const maleTooltip = createTooltip();
    maleTooltip.label.set("text", `${maleText}: {valueX}`);
    maleSeries.set("tooltip", maleTooltip);

    maleSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          fill: am5.color("#ffffff"),
          fontSize: windowWidth < 769 ? 10 : 11,
          fontWeight: "600",
          fontFamily: "Verdana",
          centerX: am5.p50,
          centerY: am5.p50,
          populateText: true,
        }),
      })
    );

    // Female Series
    const femaleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: femaleText,
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "femaleNumber",
        categoryYField: "year",
        clustered: true,
      })
    );

    femaleSeries.columns.template.setAll({
      fill: am5.color(0xf28e2b),
      strokeOpacity: 0,
      cornerRadiusTR: 6,
      cornerRadiusBR: 6,
    });

    const femaleTooltip = createTooltip();
    femaleTooltip.label.set("text", `${femaleText}: {valueX}`);
    femaleSeries.set("tooltip", femaleTooltip);

    femaleSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          fill: am5.color("#ffffff"),
          fontSize: windowWidth < 769 ? 10 : 11,
          fontWeight: "600",
          fontFamily: "Verdana",
          centerX: am5.p50,
          centerY: am5.p50,
          populateText: true,
        }),
      })
    );

    yAxis.data.setAll(formattedData);
    maleSeries.data.setAll(formattedData);
    femaleSeries.data.setAll(formattedData);

    maleSeries.appear(1000);
    femaleSeries.appear(1000);

    return () => root.dispose();
  }, [formattedData, windowWidth, maleText, femaleText]);

  const chartWidth =
    windowWidth < 769 ? "280px" : windowWidth < 1201 ? "360px" : "420px";
  const chartHeight = windowWidth < 769 ? "520px" : "580px";

  return (
    <div style={{ width: "100%", maxHeight: "80vh", overflow: "auto" }}>
      <div
        id="chartdiv"
        style={{
          width: chartWidth,
          minHeight: chartHeight,
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default BarChartGenders;
