/* eslint-disable react/prop-types */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "react";
import { useParams } from "react-router";

const BarChartGenders = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    year: String(item.year), // Convert year to string for category axis
  }));

  const { language } = useParams();

  const maleText = language === "en" ? "Male" : "კაცი";
  const femaleText = language === "en" ? "Female" : "ქალი";

  useLayoutEffect(() => {
    // Prevent duplicate root instances

    const root = am5.Root.new("chartdiv");
    root._logo.dispose(); // remove amCharts logo
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 60, // extra space for labels
      })
    );

    // Y Axis (Category: year)
    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      inversed: true,
    });
    yRenderer.grid.template.set("visible", false);
    yRenderer.labels.template.setAll({ fontSize: 13 });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: yRenderer,
      })
    );

    // X Axis (Value axis)
    const xRenderer = am5xy.AxisRendererX.new(root, {
      strokeOpacity: 0.1,
      minGridDistance: 80,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: xRenderer,
      })
    );

    xRenderer.labels.template.setAll({ fontSize: 13 });

    // Cursor (hover without crosshair lines)
    const cursor = am5xy.XYCursor.new(root, {
      behavior: "none",
      xAxis: xAxis,
      yAxis: yAxis,
    });
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);
    chart.set("cursor", cursor);

    // Male Series
    const maleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Male",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "maleNumber",
        categoryYField: "year",
        clustered: true,
        tooltip: am5.Tooltip.new(root, {
          labelText: `[fontSize: 14px]${maleText}: {valueX.formatNumber('#,###.0')}`,
        }),
      })
    );

    maleSeries.columns.template.setAll({
      fill: am5.color(0x4e79a7),
      strokeOpacity: 0,
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
    });

    maleSeries.bullets.push(() =>
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
        }),
      })
    );

    // Female Series
    const femaleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Female",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "femaleNumber",
        categoryYField: "year",
        clustered: true,
        tooltip: am5.Tooltip.new(root, {
          labelText: `[fontSize: 14px]${femaleText}: {valueX.formatNumber('#,###.0')}`,
        }),
      })
    );

    femaleSeries.columns.template.setAll({
      fill: am5.color(0xf28e2b),
      strokeOpacity: 0,
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
    });

    femaleSeries.bullets.push(() =>
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
        }),
      })
    );

    // Feed the data
    yAxis.data.setAll(formattedData);
    maleSeries.data.setAll(formattedData);
    femaleSeries.data.setAll(formattedData);

    return () => {
      root.dispose();
    };
  }, [formattedData, femaleText, maleText]);

  return (
    <div style={{ width: "100%", maxHeight: "80vh", overflow: "auto" }}>
      <div id="chartdiv" style={{ width: "300px", minHeight: "550px" }}></div>
    </div>
  );
};

export default BarChartGenders;
