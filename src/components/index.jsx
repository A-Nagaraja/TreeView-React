import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import "ag-grid-enterprise";

import { AddBox, Remove } from "@mui/icons-material";

import { useState, useEffect } from "react";

let initialValue = [
  {
    companyId: 1,
    company: "Hudson, Hane and Schmidt",
    LineFarm: 247,
    SheadArea: 7109,
    FeedArea: 6642,
    OpenArea: 5368,
    TotalArea: 8015,
    children: [
      {
        Region: "Assam",
        LineFarm: 8,
        SheadArea: 127109,
        FeedArea: 226642,
        OpenArea: 225368,
        TotalArea: 568015,
      },
    ],
  },
  // {
  //   company: "Corkery, Smitham and Smitham",
  //   LineFarm: 998,
  //   SheadArea: 7816,
  //   FeedArea: 6188,
  //   OpenArea: 8810,
  //   TotalArea: 1067,
  // },
  // {
  //   company: "Stokes-Gibson",
  //   LineFarm: 662,
  //   SheadArea: 4326,
  //   FeedArea: 843,
  //   OpenArea: 6357,
  //   TotalArea: 274,
  // },
  // {
  //   company: "Bechtelar Inc",
  //   LineFarm: 300,
  //   SheadArea: 1254,
  //   FeedArea: 1995,
  //   OpenArea: 8231,
  //   TotalArea: 5872,
  //   children: [],
  // },
  // {
  //   company: "Rice LLC",
  //   LineFarm: 832,
  //   SheadArea: 1232,
  //   FeedArea: 3609,
  //   OpenArea: 1051,
  //   TotalArea: 115,
  //   children: [],
  // },
  // {
  //   company: "McKenzie Group",
  //   LineFarm: 767,
  //   SheadArea: 3367,
  //   FeedArea: 1029,
  //   OpenArea: 4416,
  //   TotalArea: 1918,
  //   children: [],
  // },
  // {
  //   company: "Hettinger, Schiller and Welch",
  //   LineFarm: 803,
  //   SheadArea: 6664,
  //   FeedArea: 1903,
  //   OpenArea: 5468,
  //   TotalArea: 7598,
  //   children: [],
  // },
  // {
  //   company: "Berge-Dach",
  //   LineFarm: 125,
  //   SheadArea: 4248,
  //   FeedArea: 941,
  //   OpenArea: 7159,
  //   TotalArea: 4043,
  //   children: [
  //     {
  //       id: 2,
  //       name: "Child 1.1",
  //       children: [],
  //     },
  //   ],
  // },
  // {
  //   company: "Schamberger, McDermott and Rosenbaum",
  //   LineFarm: 233,
  //   SheadArea: 1432,
  //   FeedArea: 4253,
  //   OpenArea: 8016,
  //   TotalArea: 4651,
  //   children: [],
  // },
  // {
  //   company: "Champlin-Marks",
  //   LineFarm: 619,
  //   SheadArea: 2270,
  //   FeedArea: 4450,
  //   OpenArea: 1060,
  //   TotalArea: 1058,
  //   children: [],
  // },
];

function Treeview() {
  const [rowData, setRowData] = useState(initialValue);
  const [expandedRows, setExpandedRows] = useState([]);

  // Handle click to expand/collapse rows
  const handleExpandClick = (params) => {
    const companyId = params.data.company;
    console.log(companyId);

    // Check if the row is already expanded
    const isExpanded = expandedRows.includes(companyId);
    console.log("isExpandedddddd", isExpanded);

    const updateRowData = [...rowData]; // Create a copy to avoid mutation
    console.log("hereee=====", updateRowData);

    // Update the row data
    // updateRowData.forEach((row) => {
    //   if (row.company === companyId) {
    //     row.isExpanded = !isExpanded;
    //   }
    // });
    // setRowData(updateRowData);

    if (isExpanded) {
      // Collapse the row by removing the child
      console.log("hereeeee");

      const collapsedRowData = updateRowData.filter(
        (row) => row.company !== `Region:${params.data.children[0].Region}`
      );

      console.log(updateRowData);
      setRowData(collapsedRowData);
      setExpandedRows(expandedRows.filter((row) => row !== companyId));
    } else {
      //Expand the row by inserting the child
      const children = params.data.children;
      const parentIndex = rowData.findIndex((row) => row.company === companyId);

      const newRowData = [
        ...updateRowData.slice(0, parentIndex + 1),
        {
          ...children[0],
          company: `Region:${children[0].Region}`,
          isChild: true,
        },
        ...rowData.slice(parentIndex + 1),
      ];
      setRowData(newRowData);
      setExpandedRows([...expandedRows, companyId]);
    }
  };

  const cellRenderCompany = (params) => {
    console.log(params);
    const isExpanded = expandedRows.includes(params.data.company);
    const hasChildren = params.data.children && params.data.children.length > 0;
    const isChild = params.data.isChild;
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isChild && isExpanded ? (
            //Remove Icon
            <Remove
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => handleExpandClick(params)}
            />
          ) : (
            //Add Icon
            <AddBox
              style={{ marginRight: "8px", cursor: "pointer" }}
              onClick={() => handleExpandClick(params)}
            />
          )}

          {/* Company Name */}
          <span>{isChild ? params.data.Region : params.value}</span>
          {/* <span>{params.data.children}</span> */}
        </div>
        {/* If row is expanded and there are children, show the Region */}
      </div>
    );
  };

  console.log("rowDataaaaa", rowData);

  // const findChildData = (data) => {
  //   data.forEach((row, index) => {
  //     if (row.children) {
  //       console.log(`Children of row ${index}:`, row.children);
  //     } else {
  //       console.log(`Row ${index} has no children`);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   findChildData(rowData);
  // }, [rowData]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      field: "company",
      headerName: "Company -> Region -> Unit -> Line",
      flex: 2,
      cellRenderer: cellRenderCompany,
    },
    { field: "LineFarm", headerName: "Line/Farm No.", flex: 1 },
    { field: "SheadArea", headerName: "Shead Area Sqft.", flex: 1 },
    { field: "FeedArea", headerName: "Feed Area Sqft.", flex: 1 },
    { field: "OpenArea", headerName: "Open Area Sqft.", flex: 1 },
    { field: "TotalArea", headerName: "Total Area Sqft.", flex: 1 },
  ]);

  return (
    <div>
      <h1>TreeView</h1>

      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: "100vh", width: "100vw", marginTop: "10px" }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
}

export default Treeview;
