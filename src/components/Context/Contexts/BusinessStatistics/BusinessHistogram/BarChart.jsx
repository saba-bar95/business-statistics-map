/* eslint-disable react/prop-types */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "react";

const BarChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    year: String(item.year), // 👈 turns 2022 → "2022"
  }));

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 30, // 👈 gives extra space for rightmost label
      })
    );

    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );

    // Hide cursor lines
    chart.get("cursor").lineX.set("visible", false);
    chart.get("cursor").lineY.set("visible", false);

    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
      inversed: true,
    });

    yRenderer.grid.template.set("visible", false);
    yRenderer.labels.template.setAll({ fontSize: 13 });

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "year",
        renderer: yRenderer,
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 80,
        }),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 13,
    });

    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "number",
        categoryYField: "year",
      })
    );

    const tooltip = am5.Tooltip.new(root, {
      labelText:
        "[fontSize: 13px]{categoryY}: {valueX.formatNumber('#,###.0')}",
    });

    tooltip.label.setAll({
      fontWeight: "600",
      fontFamily: "Verdana",
    });

    series.set("tooltip", tooltip);

    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
      fill: am5.color(0x83c2e1),
    });

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX.formatNumber('#,###.0')}",
          populateText: true,
          fontSize: 11,
          centerY: am5.p50,
          x: 0,
          fill: am5.color(0x333333),
          fontWeight: "600",
          fontFamily: "Verdana",
          maxWidth: 40,
          oversizedBehavior: "",
        }),
      })
    );

    yAxis.data.setAll(formattedData);
    series.data.setAll(formattedData);

    return () => {
      root.dispose();
    };
  }, [formattedData]);

  return (
    <div
      id="chartdiv"
      style={{ width: "100%", height: "550px", marginTop: "30px" }}
    />
  );
};

export default BarChart;
