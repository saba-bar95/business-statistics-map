import "./Navigation.scss";
import { useContext } from "react";
import queries from "./queries";
import { QueriesContext } from "../../App";
import Context from "../Context/Context";
import { useParams } from "react-router";

const Navigation = () => {
  const {
    selectedQuery,
    selectedLink,
    handleSelectQuery,
    handleSelectLink,
    closeSidebar,
  } = useContext(QueriesContext);

  const { language } = useParams();

  const field = language === "ge" ? "დარგი" : "Field";

  return (
    <div className="navigation">
      <div className="navigation-container">
        <ul role="tablist">
          {selectedQuery.links
            .filter((link) => link.href !== "menu") // This hides the "menu" tab
            .map((el, i) => (
              <li
                key={i}
                onClick={() => handleSelectLink(el)}
                className={
                  selectedLink &&
                  selectedLink[`name_${language}`] === el[`name_${language}`]
                    ? "selected"
                    : ""
                }
                title={el[`name_${language}`]}>
                <a role="tab">
                  <i
                    className={`fa fa-${
                      el.href === "home"
                        ? "table"
                        : el.href === "pie"
                        ? "pie-chart"
                        : el.href === "bar"
                        ? "bar-chart"
                        : el.href === "regmun"
                        ? "globe"
                        : "search"
                    }`}></i>
                </a>
              </li>
            ))}
        </ul>
        {selectedLink !== null && (
          <div className="sidebar">
            <div className="upper">
              <h2>
                {selectedLink.href === "menu"
                  ? `${field} - ${selectedLink[`name_${language}`]}`
                  : selectedLink[`name_${language}`]}
              </h2>
              <span
                className="sidebar-close"
                onClick={() => {
                  closeSidebar();
                }}>
                <i className="fa fa-caret-left"></i>
              </span>
            </div>
            {selectedLink.href === "menu" && (
              <ul>
                {queries.map((el, i) =>
                  el[`title_${language}`] !==
                  selectedQuery[`title_${language}`] ? (
                    <li
                      key={i}
                      onClick={() => {
                        handleSelectQuery(el);
                        handleSelectLink(el.links[0]);
                      }}>
                      {el[`title_${language}`]}
                    </li>
                  ) : null
                )}
              </ul>
            )}
            {selectedLink.href !== "menu" && <Context />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
