/* eslint-disable react/prop-types */
import { useLayoutEffect, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useParams } from "react-router";

const PieChart = ({ data, year }) => {
  const { language } = useParams();

  // 🎨 Color palette by region_id with name references
  const colorPalette = useMemo(() => {
    return {
      11: "rgb(103, 183, 220)", // C. Tbilisi
      15: "rgb(253, 212, 0)", // Adjara A.R.
      23: "rgb(132, 183, 97)", // Guria
      26: "rgb(204, 71, 72)", // Imereti
      29: "rgb(205, 130, 173)", // Kakheti
      32: "rgb(47, 64, 116)", // Mtskheta-Mtianeti
      35: "rgb(183, 184, 63)", // Racha-Lechkhumi and Kvemo Svaneti
      38: "rgb(185, 120, 63)", // Samegrelo-Zemo Svaneti
      41: "rgb(185, 62, 61)", // Samtskhe-Javakheti
      44: "rgb(68, 142, 77)", // Kvemo Kartli
      47: "rgb(145, 49, 103)", // Shida Kartli
      default: "#1a0c1b", // fallback
    };
  }, []);

  // 🧠 Filter and colorize data
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
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // 📊 Create chart with vertical layout
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout, // 👈 ensures chart and legend stack
        paddingTop: -90,
      })
    );

    // 🥧 Pie series setup
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

    series.slices.template.setAll({
      tooltipText:
        "{category}: {value} ({valuePercentTotal.formatNumber('0.0')}%)",
    });

    const tooltip = am5.Tooltip.new(root, {
      labelText:
        "{category}:  [fontSize: 12px]{value} [fontSize: 12px]({valuePercentTotal.formatNumber('0.0')}%)",
    });

    tooltip.label.setAll({
      fontSize: 13,
      fontWeight: "600",
      fontFamily: "Verdana",
    });

    series.set("tooltip", tooltip);
    series.data.setAll(coloredData);

    series.appear(1000, 100);

    // 📘 Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        y: am5.percent(0),
        centerY: am5.percent(-120),
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100), // 👈 full width of chart container
        useDefaultMarker: true,
      })
    );

    legend.itemContainers.template.setAll({
      width: am5.percent(100),
    });

    legend.labels.template.setAll({
      fontSize: 14,
      fontWeight: "600",
      fontFamily: "Verdana",
      oversizedBehavior: "wrap",
      maxWidth: 200,
    });

    legend.valueLabels.template.setAll({
      fontSize: 13,
      fontWeight: "600",
      fontFamily: "Verdana",
      x: am5.percent(100),
      textAlign: "right",
    });

    legend.markers.template.setAll({
      width: 15,
      height: 15,
    });

    const sortedDataItems = [...series.dataItems].sort((a, b) => {
      return b.get("value") - a.get("value");
    });

    legend.data.setAll(sortedDataItems);

    series.labels.template.setAll({
      forceHidden: true,
    });

    series.ticks.template.setAll({
      forceHidden: true,
    });

    return () => root.dispose();
  }, [coloredData, language, year]);

  return <div id="chartdiv" style={{ width: "300px", height: "100%" }}></div>;
};

export default PieChart;
