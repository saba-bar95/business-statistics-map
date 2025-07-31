import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  LayersControl,
  GeoJSON,
} from "react-leaflet";
import { useState, useContext, useRef, useEffect, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import "./MapComponent.scss";
import regions from "../../coordinates/regions";
import municipalities from "../../coordinates/municipalities";
import getStyle from "../../functions/getStyle";
import MapEventsHandler from "../../functions/MapEventsHandler";
import { QueriesContext } from "../../App";
import checkNumberRange from "../../functions/checkNumberRange";
import { useParams } from "react-router";
import MarkerClusterGroup from "react-leaflet-markercluster";
import createCustomClusterIcon from "../../functions/createCustomClusterIcon";

const MapComponent = () => {
  const [zoomLevel, setZoomLevel] = useState(8);
  const center = [41.9, 43.9];

  const {
    regData,
    munData,
    indicator,
    indicators,
    indicatorYear,
    indicatorInfo,
    companiesData,
  } = useContext(QueriesContext);
  const { language } = useParams();

  const [regionsReady, setRegionsReady] = useState(false);

  const regionRefs = useRef({});

  const setupHoverListeners = useCallback(() => {
    Object.values(regionRefs.current).forEach((geoJsonLayer) => {
      if (geoJsonLayer) {
        geoJsonLayer.eachLayer((layer) => {
          layer.off("mouseover");
          layer.off("mouseout");

          layer.on("mouseover", (e) => {
            if (zoomLevel < 9) {
              e.target.setStyle({
                weight: 5,
                fillOpacity: 0.7,
              });
            }
          });

          layer.on("mouseout", (e) => {
            if (zoomLevel < 9) {
              e.target.setStyle({
                weight: 3,
                fillOpacity: 0.5,
              });
            }
          });
        });
      }
    });
  }, [zoomLevel]); // 👈

  useEffect(() => {
    if (!regionsReady) return;
    setupHoverListeners();
  }, [regionsReady, setupHoverListeners]);

  return (
    <>
      <MapContainer center={center} zoom={8} zoomControl={false}>
        <LayersControl>
          <LayersControl.BaseLayer checked name="Google Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google</a>'
              url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
            <LayersControl.BaseLayer name="Google Street">
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google</a>'
                url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Google Satellite">
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google</a>'
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Google Hybrid">
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google</a>'
                url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl.BaseLayer>
        </LayersControl>

        {companiesData && Array.isArray(companiesData) && (
          <MarkerClusterGroup iconCreateFunction={createCustomClusterIcon}>
            {companiesData.map((company, index) => {
              const { X, Y, Full_Name, Address } = company;

              // Only render if coordinates are valid numbers
              if (typeof X !== "number" || typeof Y !== "number") return null;

              return (
                <Marker key={index} position={[X, Y]}>
                  <Popup>
                    <strong>{Full_Name}</strong>
                    <br />
                    {Address}
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {regData &&
          Object.entries(regions).map(([key, value]) => {
            const region = regData.find(
              (region) =>
                +region.region_id === +value.id ||
                region.REGION_ID === +value.id ||
                region.municipal_ === +value.id
            );

            const regionNumber = region ? region[`w_${indicatorYear}`] : 0;
            const regionFemaleRaw = region[`f_${indicatorYear}`];
            const regionMaleRaw = region[`m_${indicatorYear}`];

            const regionFemaleNumber =
              typeof regionFemaleRaw === "number"
                ? indicator === indicators[11]
                  ? Math.floor(regionFemaleRaw)
                  : parseFloat(regionFemaleRaw.toFixed(1))
                : null;

            const regionMaleNumber =
              typeof regionMaleRaw === "number"
                ? indicator === indicators[11]
                  ? Math.floor(regionMaleRaw)
                  : parseFloat(regionMaleRaw.toFixed(1))
                : null;

            const regColor =
              indicator === indicators[11] || indicator === indicators[12]
                ? checkNumberRange(regionMaleNumber, indicatorInfo)
                : checkNumberRange(regionNumber, indicatorInfo);

            return (
              <GeoJSON
                ref={(el) => {
                  regionRefs.current[key] = el;

                  if (
                    Object.keys(regionRefs.current).length ===
                    Object.entries(regions).length
                  ) {
                    setRegionsReady(true);
                  }
                }}
                key={key}
                data={value}
                style={getStyle(value, zoomLevel, "region", regColor)}>
                <Popup>
                  <p className="popup-para">{region[`name_${language}`]}</p>

                  {typeof regionNumber === "number" &&
                    value.id !== "12" &&
                    value.id !== "48" && (
                      <>
                        <p className="popup-para">{indicator}</p>
                        <p>
                          {regionNumber.toFixed(1)} (
                          {indicatorInfo[`measurement_${language}`]}){" "}
                        </p>
                      </>
                    )}

                  {regionFemaleNumber && (
                    <>
                      <p className="popup-para">{region[`NAME_GE`]}</p>

                      <p className="popup-para">{indicator}</p>
                      <p>
                        <span style={{ fontWeight: 900 }}>
                          {language === "en" ? "Female" : "ქალი"}
                        </span>
                        : {regionFemaleNumber}
                        {indicator === indicators[12] && (
                          <> ({indicatorInfo[`measurement_${language}`]})</>
                        )}
                      </p>
                    </>
                  )}
                  {regionMaleNumber && (
                    <p>
                      <span style={{ fontWeight: 900 }}>
                        {language === "en" ? "Male" : "მამაკაცი"}
                      </span>
                      : {regionMaleNumber}
                      {indicator === indicators[12] && (
                        <> ({indicatorInfo[`measurement_${language}`]})</>
                      )}
                    </p>
                  )}
                </Popup>
              </GeoJSON>
            );
          })}

        {munData &&
          indicatorYear > 2013 &&
          zoomLevel > 8 &&
          municipalities.features.map((el) => {
            const municipality = munData.find(
              (mun) => mun.municipal_ === el.properties.MUNICIPAL1
            );

            const munNumber =
              municipality?.value ??
              municipality?.[`w_${indicatorYear}`] ??
              "N/A";

            const munColor = checkNumberRange(munNumber, indicatorInfo);

            return (
              <GeoJSON
                key={el.properties.NAME_GE}
                data={el}
                style={getStyle(el, zoomLevel, "municipality", munColor)}
                onEachFeature={(_, layer) => {
                  layer.on({
                    mouseover: (e) => {
                      e.target.setStyle({
                        weight: 5,
                        fillOpacity: 0.7,
                      });
                    },
                    mouseout: (e) => {
                      e.target.setStyle({
                        weight: 3,
                        fillOpacity: 0.5,
                      });
                    },
                  });
                }}>
                <Popup>
                  <p className="popup-para">
                    {language === "ge"
                      ? el.properties.NAME_SYLFA
                      : el.properties.NAME_EN}
                  </p>
                  <p className="popup-para">{indicator}</p>
                  <p>
                    {typeof munNumber === "number"
                      ? munNumber.toFixed(1)
                      : munNumber}{" "}
                    {indicatorInfo[`measurement_${language}`]}
                  </p>
                </Popup>
              </GeoJSON>
            );
          })}
        <MapEventsHandler setZoomLevel={setZoomLevel} />
      </MapContainer>
    </>
  );
};

export default MapComponent;
