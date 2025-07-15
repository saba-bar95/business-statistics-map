/* eslint-disable react/prop-types */
import { useLayoutEffect, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useParams } from "react-router";

const PieChartGenders = ({ data, year }) => {
  const { language } = useParams();

  const colorPalette = useMemo(
    () => ({
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
    }),
    []
  );

  const coloredData = useMemo(() => {
    return data
      .filter(
        (item) =>
          item[`f_${year}`] != null &&
          item[`m_${year}`] != null &&
          item.region_id != 12 &&
          item.region_id != 48
      )
      .map((item) => {
        const female = item[`f_${year}`];
        const male = item[`m_${year}`];
        const total = female + male;

        return {
          name: item[`name_${language}`],
          region_id: item.region_id,
          female,
          male,
          total,
          femalePercent: (female / total) * 100,
          malePercent: (male / total) * 100,
          color: am5.color(
            colorPalette[item.region_id] || colorPalette.default
          ),
        };
      });
  }, [data, year, language, colorPalette]);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        paddingTop: -40,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "total",
        categoryField: "name",
        fillField: "color",
      })
    );

    series.labels.template.setAll({ forceHidden: true });
    series.ticks.template.setAll({ forceHidden: true });

    const tooltipText =
      "{category}\n👩 {female.formatNumber('0.0')} ({femalePercent.formatNumber('0.0')}%)\n👨 {male.formatNumber('0.0')} ({malePercent.formatNumber('0.0')}%)";

    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      tooltipText,
      cursorOverStyle: "pointer",
      interactive: true,
    });

    const tooltip = am5.Tooltip.new(root, { labelText: tooltipText });

    tooltip.label.setAll({
      fontSize: 13,
      fontWeight: "600",
      fontFamily: "Verdana",
    });

    series.set("tooltip", tooltip);
    series.data.setAll(coloredData);
    series.appear(1000, 100);

    const centerYOffset = language === "en" ? -120 : -100;

    const legend = chart.children.push(
      am5.Legend.new(root, {
        y: am5.percent(0),
        centerY: am5.percent(centerYOffset),
        x: am5.percent(50),
        centerX: am5.percent(50),
        width: am5.percent(100),
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
      text: "👩 {female.formatNumber('0.0')} / 👨 {male.formatNumber('0.0')}",
    });

    legend.markers.template.setAll({
      width: 15,
      height: 15,
    });

    const sortedDataItems = [...series.dataItems].sort((a, b) => {
      return b.get("value") - a.get("value");
    });

    legend.data.setAll(sortedDataItems);

    return () => root.dispose();
  }, [coloredData, language]);

  return <div id="chartdiv" style={{ width: "300px", height: "100%" }}></div>;
};

export default PieChartGenders;
