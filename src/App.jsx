import Table from "./components/Table";
import React, { useState, useEffect } from "react";

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Film_Locations_in_San_Francisco.csv")
      .then((response) => response.text())
      .then((csvData) => parseCSV(csvData));
  }, []);

  const parseCSV = (csvData) => {
    const rows = csvData.split("\n").map((row) => row.split(","));

    const columnNames = rows[0];

    const mappedData = rows.slice(1).map((row) => {
      const rowObject = {};
      columnNames.forEach((col, index) => {
        rowObject[col.trim()] = row[index]?.trim() || "";
      });
      return rowObject;
    });

    setColumns(columnNames);
    setData(mappedData);
  };

  return <>{columns.length > 0 && <Table columns={columns} data={data} />}</>;
}

export default App;
