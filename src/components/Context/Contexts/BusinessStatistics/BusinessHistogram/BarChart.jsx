/* eslint-disable react/prop-types */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect, useState, useEffect } from "react";

const BarChart = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 20,
        paddingBottom: 100,
        layout: root.verticalLayout,
      })
    );

    // Cursor (hidden lines)
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    // Y Axis (categories - years)
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

    // X Axis (values)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 60,
        }),
      })
    );

    // Responsive font sizes
    const axisFontSize = windowWidth < 769 ? 11 : windowWidth < 1201 ? 12 : 13;
    const bulletFontSize =
      windowWidth < 769 ? 10 : windowWidth < 1201 ? 11 : 12;

    yRenderer.labels.template.setAll({
      fontSize: axisFontSize,
      fontFamily: "Verdana",
    });
    xAxis.get("renderer").labels.template.setAll({
      fontSize: axisFontSize,
      fontFamily: "Verdana",
    });

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "number",
        categoryYField: "year",
      })
    );

    series.columns.template.setAll({
      cornerRadiusTR: 6,
      cornerRadiusBR: 6,
      strokeOpacity: 0,
      fill: am5.color(0x83c2e1),
    });

    // TOOLTIP — same beautiful style as your PieChart
    const tooltip = am5.Tooltip.new(root, {
      labelText: "{categoryY}: {valueX.formatNumber('#,###')}",
      getFillFromSprite: false,
      autoTextColor: false,
    });

    // Dark consistent background
    tooltip.get("background")?.setAll({
      fill: am5.color("#1a1a1a"),
      fillOpacity: 0.95,
      stroke: am5.color("#444444"),
      strokeWidth: 1,
      strokeOpacity: 0.6,
      cornerRadius: 8,
    });

    // Responsive tooltip font + padding
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

    series.set("tooltip", tooltip);

    // Value labels on bars
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX.formatNumber('#,###')}",
          fill: am5.color("#ffffff"),
          fontWeight: "600",
          fontSize: bulletFontSize,
          fontFamily: "Verdana",
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true,
        }),
      })
    );

    // Data
    yAxis.data.setAll(formattedData);
    series.data.setAll(formattedData);
    series.appear(1000, 100);

    return () => root.dispose();
  }, [formattedData, windowWidth]);

  // Responsive container size (same logic as your PieChart)
  const chartWidth =
    windowWidth < 769 ? "260px" : windowWidth < 1201 ? "320px" : "380px";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        flex: 1,
      }}>
      <div
        id="chartdiv"
        style={{
          width: chartWidth,
          height: "100%",
        }}
      />
    </div>
  );
};

export default BarChart;
