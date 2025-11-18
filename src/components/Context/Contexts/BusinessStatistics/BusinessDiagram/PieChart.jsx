/* eslint-disable react/prop-types */
import { useLayoutEffect, useMemo, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useParams } from "react-router";

const PieChart = ({ data, year }) => {
  const { language } = useParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorPalette = useMemo(() => {
    return {
      11: "rgb(103, 183, 220)",
      15: "rgb(253, 212, 0)",
      23: "rgb(132, 183, 97)",
      26: "rgb(204, 71, 72)",
      29: "rgb(205, 130, 173)",
      32: "rgb(47, 64, 116)",
      35: "rgb(183, 184, 63)",
      38: "rgb(185, 120, 63)",
      41: "rgb(185, 62, 61)",
      44: "rgb(68, 142, 77)",
      47: "rgb(145, 49, 103)",
      default: "#1a0c1b",
    };
  }, []);

  const coloredData = useMemo(() => {
    return data
      .filter(
        (item) =>
          item[`w_${year}`] != null &&
          item.region_id !== "12" &&
          item.region_id !== "48"
      )
      .map((item) => ({
        ...item,
        color: am5.color(colorPalette[item.region_id] || colorPalette.default),
      }));
  }, [data, year, colorPalette]);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        paddingTop:
          language === "en"
            ? windowWidth < 769
              ? -140
              : windowWidth < 1201
              ? -175
              : -130
            : windowWidth < 769
            ? -200
            : windowWidth < 1201
            ? -150
            : -130,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: `w_${year}`,
        categoryField: `name_${language}`,
        fillField: "color",
        legendLabelText: "{category}",
        legendValueText: "{value.formatNumber('0.0')}",
      })
    );

    series.states.create("hidden", { endAngle: -90 });

    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      interactive: true,
      cursorOverStyle: "pointer",
    });

    // TOOLTIP
    const tooltip = am5.Tooltip.new(root, {
      labelText:
        "{category}: {value} ({valuePercentTotal.formatNumber('0.0')}%)",
    });

    // RESPONSIVE FONT SIZE (on label)
    const fontSize =
      language === "en"
        ? windowWidth < 769
          ? 9
          : windowWidth < 1201
          ? 12
          : 13
        : windowWidth < 769
        ? 10
        : windowWidth < 1201
        ? 13
        : 14;

    tooltip.label.setAll({
      fontSize,
      fontWeight: "600",
      fontFamily: "Verdana",
    });

    // RESPONSIVE PADDING — THIS IS THE CORRECT WAY (on tooltip, not label!)
    const paddingVertical = windowWidth < 769 ? 3 : windowWidth < 1201 ? 5 : 7;
    const paddingHorizontal =
      windowWidth < 769 ? 6 : windowWidth < 1201 ? 9 : 12;

    tooltip.setAll({
      paddingTop: paddingVertical,
      paddingBottom: paddingVertical,
      paddingLeft: paddingHorizontal,
      paddingRight: paddingHorizontal,
      background: am5.RoundedRectangle.new(root, {
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        cornerRadiusBL: 6,
        cornerRadiusBR: 6,
      }),
    });

    series.set("tooltip", tooltip);

    series.data.setAll(coloredData);
    series.appear(1000, 100);

    // Legend (unchanged - your code is perfect)
    const legend = chart.children.push(
      am5.Legend.new(root, {
        y: am5.percent(0),
        centerY: am5.percent(
          language === "en"
            ? windowWidth < 769
              ? -95
              : windowWidth < 1201
              ? -150
              : -135
            : windowWidth < 769
            ? -145
            : windowWidth < 1201
            ? -135
            : -125
        ),
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100),
        useDefaultMarker: true,
      })
    );

    legend.itemContainers.template.setAll({ width: am5.percent(100) });

    legend.labels.template.setAll({
      fontSize:
        language === "en"
          ? windowWidth < 769
            ? 11
            : windowWidth < 1201
            ? 12
            : 13
          : windowWidth < 769
          ? 12
          : windowWidth < 1201
          ? 13
          : 14,
      fontWeight: "600",
      fontFamily: "Verdana",
      oversizedBehavior: "wrap",
      maxWidth:
        language === "en"
          ? windowWidth < 769
            ? 120
            : windowWidth < 1201
            ? 185
            : 200
          : windowWidth < 769
          ? 120
          : windowWidth < 1201
          ? 185
          : 200,
      maxHeight: 30,
    });

    legend.valueLabels.template.setAll({
      fontSize: windowWidth < 769 ? 11 : windowWidth < 1201 ? 12 : 13,
      fontWeight: "600",
      fontFamily: "Verdana",
      x: am5.percent(windowWidth < 769 ? 100 : windowWidth < 1201 ? 90 : 95),
      textAlign: "right",
    });

    legend.markers.template.setAll({
      width: windowWidth < 769 ? 11 : windowWidth < 1201 ? 13 : 15,
      height: windowWidth < 769 ? 11 : windowWidth < 1201 ? 13 : 15,
    });

    const sortedDataItems = [...series.dataItems].sort(
      (a, b) => b.get("value") - a.get("value")
    );
    legend.data.setAll(sortedDataItems);

    series.labels.template.setAll({ forceHidden: true });
    series.ticks.template.setAll({ forceHidden: true });

    return () => root.dispose();
  }, [coloredData, language, year, windowWidth]);

  return (
    <div style={{ width: "100%", maxHeight: "80vh", overflow: "auto" }}>
      <div
        id="chartdiv"
        style={{
          width:
            windowWidth < 769
              ? "200px"
              : windowWidth < 1201
              ? "280px"
              : "290px",
          minHeight: "700px",
        }}
      />
    </div>
  );
};

export default PieChart;
