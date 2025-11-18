/* eslint-disable react/prop-types */
import { useLayoutEffect, useMemo, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useParams } from "react-router";

const PieChartGenders = ({ data, year }) => {
  const { language } = useParams();

  // Responsive window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // Force clean number format: 1,234.0
    root.numberFormatter.set("numberFormat", "#,###.0");

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        paddingTop:
          language === "en"
            ? windowWidth < 769
              ? -190
              : windowWidth < 1201
              ? -175
              : -130
            : windowWidth < 769
            ? -150
            : windowWidth < 1201
            ? -160
            : -120,
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

    const femaleLabel = language === "en" ? "Female" : "ქალი";
    const maleLabel = language === "en" ? "Male" : "კაცი";
    const tooltipText = `{category}\n[bold]${femaleLabel}[/]: {female} ({femalePercent.formatNumber('0.0')}%)\n[bold]${maleLabel}[/]: {male} ({malePercent.formatNumber('0.0')}%)`;

    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      tooltipText,
      cursorOverStyle: "pointer",
      interactive: true,
    });

    // PROFESSIONAL DARK TOOLTIP — same as other charts
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
      fill: am5.color("#ffffff"),
      fontSize: tooltipFontSize,
      fontWeight: "600",
      fontFamily: "Verdana",
    });

    const paddingV = windowWidth < 769 ? 3 : windowWidth < 1201 ? 5 : 7;
    const paddingH = windowWidth < 769 ? 6 : windowWidth < 1201 ? 9 : 12;

    tooltip.setAll({
      paddingTop: paddingV,
      paddingBottom: paddingV,
      paddingLeft: paddingH,
      paddingRight: paddingH,
    });

    series.set("tooltip", tooltip);
    series.data.setAll(coloredData);
    series.appear(1000, 100);

    // Responsive legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        y: am5.percent(0),
        centerY: am5.percent(
          language === "en"
            ? windowWidth < 769
              ? -105
              : windowWidth < 1201
              ? -150
              : -135
            : windowWidth < 769
            ? -80
            : windowWidth < 1201
            ? -125
            : -110
        ),
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
      text: "Female {female} / Male {male}",
    });

    legend.markers.template.setAll({
      width: windowWidth < 769 ? 11 : windowWidth < 1201 ? 13 : 15,
      height: windowWidth < 769 ? 11 : windowWidth < 1201 ? 13 : 15,
    });

    const sortedDataItems = [...series.dataItems].sort((a, b) => {
      return b.get("value") - a.get("value");
    });
    legend.data.setAll(sortedDataItems);

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
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default PieChartGenders;
