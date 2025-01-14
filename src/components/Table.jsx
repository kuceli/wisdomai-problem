import React, { useState } from "react";
import "../../src/index.css";
import { CiViewColumn, CiSearch } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

const Table = ({ columns, data }) => {
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filterString, setFilterString] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [error, setError] = useState(null);

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const togglePopup = () => {
    setIsPopupVisible((prev) => !prev);
  };

  const applyFilters = () => {
    try {
      setError(null);

      if (filterString.trim() === "") {
        setFilteredData(data);
        return;
      }

      const filters = filterString.split(" AND ").map((filter) => {
        const match = filter.match(/"(.*?)"\s*(=|=~)\s*"(.*?)"/);
        if (!match) throw new Error("Invalid filter format");

        const [_, column, condition, value] = match;
        return { column, condition, value };
      });

      const filtered = data.filter((row) =>
        filters.every(({ column, condition, value }) => {
          if (!row[column]) return false;
          if (condition === "=") {
            return row[column].toString() === value;
          } else if (condition === "=~") {
            return row[column].toString().includes(value);
          }
          return false;
        })
      );

      setFilteredData(filtered);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-container">
      <div className="filter-section">
        <input
          type="text"
          placeholder='Enter a filter string (e.g., "Title" = "The Matrix")'
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
          className="filter-input"
        />
        <button onClick={applyFilters} className="filter-button filter-icon">
          <CiSearch size={20} />
        </button>
        <div className="toggle-icon filter-icon" onClick={togglePopup}>
          <CiViewColumn size={20} />
          <p>Columns</p>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}

      {isPopupVisible && (
        <div className="popup">
          {columns.map((column) => (
            <div key={column} className="checkbox-container">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id={`cbx-${column}`}
                  checked={visibleColumns.includes(column)}
                  onChange={() => toggleColumnVisibility(column)}
                />
                <label htmlFor={`cbx-${column}`} className="toggle">
                  <span></span>
                </label>
              </div>
              <label>{column}</label>
            </div>
          ))}
        </div>
      )}

      <table className="movie-table">
        <thead>
          <tr>
            {columns.map(
              (column, index) =>
                visibleColumns.includes(column) && <th key={index}>{column}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(
                (col, colIndex) =>
                  visibleColumns.includes(col) && (
                    <td key={colIndex}>{row[col]}</td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
