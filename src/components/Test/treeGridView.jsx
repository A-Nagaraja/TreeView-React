import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";

import styles from "../../styles/treeView.module.css";
import SearchGrid from "./search";
import TreeTableRow from "./treeRow";
import { SwapVert } from "@mui/icons-material";

const url = "http://localhost:4000/company";

function TreeViewGrid() {
  const [rowData, setRowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState("default"); // State to manage sorting

  const [page, setPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Define the number of rows per page

  console.log("searchTerm", searchTerm); // Search term

  // Use a single object to track expanded rows
  const [expandedRows, setExpandedRows] = useState({
    companies: [],
    regions: [],
    units: [],
  });

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Function to filter data based on the search term
  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data; //if no search term, return all data

    return data.filter((company) => {
      //Check if the company name or any of its child entities match the search term

      const companyMatches = company.company
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const regionMatches = company.children?.some((region) =>
        region.Region.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const unitMatches = company.children?.some((region) =>
        region.children?.some((unit) =>
          unit.Unit?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      //Return the company if any match is found
      return companyMatches || regionMatches || unitMatches;
    });
  };

  // Function to sort data based on the sort order
  const sortData = (data, order) => {
    if (order === "default") return data; // No sorting applied
    return [...data].sort((a, b) => {
      const nameA = a.company.toLowerCase();
      const nameB = b.company.toLowerCase();
      if (order === "asc") return nameA > nameB ? 1 : -1;

      if (order === "desc") return nameA < nameB ? 1 : -1;
      return 0;
    });
  };

  // //Filter row data based on search term
  // const filteredRowData = filterData(rowData, searchTerm);

  // Apply both search and sorting to the rowData
  const filteredRowData = sortData(filterData(rowData, searchTerm), sortOrder);

  console.log("filteredRowDataLength", filteredRowData.length);

  // Get the subset of filteredRowData based on page and rowsPerPage
  const paginatedData = filteredRowData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handle sorting toggle on clicking the icon
  const handleSort = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === "default") return "asc"; // First click -> ascending
      if (prevOrder === "asc") return "desc"; // Second click -> descending
      return "default"; // Third click -> default (API sequence)
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    console.log("newPage", newPage);
  };

  // Generic function to handle toggling of expanded rows
  const toggleExpandedRow = (type, id) => {
    console.log("hereeeee");
    setExpandedRows((prevState) => {
      console.log("prevStateee", prevState);
      const currentExpanded = prevState[type];
      const isCurrentlyExpanded = currentExpanded.includes(id);
      console.log("currentExpandedddd", currentExpanded, isCurrentlyExpanded);
      if (isCurrentlyExpanded) {
        // Collapse and remove all nested child rows if the parent is collapsing

        let updatedState = {
          ...prevState,
          [type]: currentExpanded.filter((rowId) => rowId !== id),
        };

        //Remove all nested rows if collapsing a company
        if (type === "companies") {
          const nestedRegions = getNestedRows("regions", id);
          const nestedUnits = nestedRegions.flatMap((regionId) =>
            getNestedRows("units", regionId)
          );

          updatedState = {
            ...updatedState,
            regions: prevState.regions.filter(
              (regionId) => !nestedRegions.includes(regionId)
            ),
            units: prevState.units.filter(
              (unitId) => !nestedUnits.includes(unitId)
            ),
          };
        } else if (type === "regions") {
          //Remove units if collapsing a region
          const nestedUnits = getNestedRows("units", id);
          updatedState.units = prevState.units.filter(
            (unitId) => !nestedUnits.includes(unitId)
          );
        }
        return updatedState;
      } else {
        // Expand the row if it's not currently expanded
        return { ...prevState, [type]: [...currentExpanded, id] };
      }
    });
  };

  // Helper function to retrieve nested child rows by type

  const getNestedRows = (type, parentId) => {
    // Adjust this logic to retrieve the nested child IDs for your data structure
    if (type === "regions") {
      return (
        rowData
          .find((company) => company.companyId === parentId)
          ?.children?.map((region) => region.RegionId) || []
      );
    } else if (type === "units") {
      return rowData.flatMap(
        (company) =>
          company.children
            ?.find((region) => region.RegionId === parentId)
            ?.children?.map((unit) => unit.UnitId) || []
      );
    }
    return [];
  };

  const isRowExpanded = (type, id) => expandedRows[type]?.includes(id);

  console.log("rowDataaaaaa", rowData);
  // console.log("expandedRows", expandedRows);

  async function getCompaniesAndRest() {
    try {
      const apiResponse = await fetch(url, {
        method: "GET",
      });
      const result = await apiResponse.json();
      setRowData(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCompaniesAndRest();
  }, []);

  return (
    <>
      <div
        style={{
          // display: "flex",
          // flexDirection: "column",
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
        }}
      >
        {/* Render SearchGrid and pass searchTerm and onSearch handler */}
        <SearchGrid searchTerm={searchTerm} onSearch={handleSearch} />
        <TableContainer component={Paper}>
          <Table aria-label="tree view grid">
            <TableHead>
              <TableRow>
                <TableCell className={styles.headerTableCellWithBorder}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginLeft: "20px" }}>
                      Company / Region / Unit / Line
                    </span>
                    <div>
                      <IconButton
                        className={styles.sortIcon}
                        size="small"
                        onClick={handleSort}
                      >
                        <SwapVert />
                      </IconButton>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={styles.headerTableCellWithBorder}>
                  Line/Farm No.
                </TableCell>
                <TableCell className={styles.headerTableCellWithBorder}>
                  Shead Area (sqft)
                </TableCell>
                <TableCell className={styles.headerTableCellWithBorder}>
                  Feed Area (sqft)
                </TableCell>
                <TableCell className={styles.headerTableCellWithBorder}>
                  Open Area (sqft)
                </TableCell>
                <TableCell className={styles.headerTableCellWithBorder}>
                  Total Area (sqft)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((company) => (
                <TreeTableRow
                  key={company.companyId}
                  row={company}
                  level={0} // level:0 Company
                  isExpanded={isRowExpanded("companies", company.companyId)}
                  onToggle={() =>
                    toggleExpandedRow("companies", company.companyId)
                  }
                >
                  {/*Render regions if company is expried*/}
                  {company.children?.map((region) => (
                    <TreeTableRow
                      key={region.RegionId}
                      row={{ ...region, name: region.Region }}
                      level={1} //level 1: Region
                      isExpanded={isRowExpanded("regions", region.RegionId)}
                      onToggle={() =>
                        toggleExpandedRow("regions", region.RegionId)
                      }
                    >
                      {/*Render units if region is expanded*/}
                      {region.children?.map((unit) => (
                        <TreeTableRow
                          key={unit.UnitId}
                          row={{ ...unit, name: unit.Unit }}
                          level={2} //level 2: Unit
                          isExpanded={isRowExpanded("units", unit.UnitId)}
                          onToggle={() =>
                            toggleExpandedRow("units", unit.UnitId)
                          }
                        >
                          {/* Render lines if unit is expanded*/}
                          {unit.children?.map((line) => (
                            <TreeTableRow
                              key={line.LineId}
                              row={{ ...line, name: line.Line }}
                              level={3} //level 3:Line
                              isExpanded={isRowExpanded("lines", line.LineId)}
                              onToggle={() =>
                                toggleExpandedRow("lines", line.LineId)
                              }
                            />
                          ))}
                        </TreeTableRow>
                      ))}
                    </TreeTableRow>
                  ))}
                </TreeTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "white",
          }}
        >
          <Pagination
            variant="outlined"
            shape="rounded"
            count={Math.ceil(filteredRowData.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </>
  );
}

export default TreeViewGrid;
