import React from "react";

import { TableCell, TableRow, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import styles from "../../styles/treeView.module.css";

// Reusable component for hierarchical row rendering
const TreeTableRow = ({
  row, // The current row object (company, region, unit, line)
  level, // The level of nesting (0: company, 1: region, 2: unit, etc.)
  isExpanded, // Whether the current row is expanded
  onToggle, // Function to toggle expand/collapse
  children, // The child rows to render if expanded
}) => {
  const paddingLeft = `${20 + level * 20}px`; // Dynamically calculate padding based on level

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell
          className={
            (styles.bodyTableCellWithBorder, row.Line && styles.shiftLeft20px)
          }
          style={{
            paddingLeft: row.children ? paddingLeft : "40px",
          }}
        >
          {row.children?.length > 0 && (
            <IconButton
              className={styles.expandIcon}
              size="small"
              onClick={onToggle}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          {row.name || row.company || row.Region || row.Unit || row.Line}{" "}
          {/* Handles multiple levels */}
        </TableCell>
        <TableCell className={styles.bodyTableCellWithBorder}>
          {row.LineFarm}
        </TableCell>
        <TableCell className={styles.bodyTableCellWithBorder}>
          {row.SheadArea}
        </TableCell>
        <TableCell className={styles.bodyTableCellWithBorder}>
          {row.FeedArea}
        </TableCell>
        <TableCell className={styles.bodyTableCellWithBorder}>
          {row.OpenArea}
        </TableCell>
        <TableCell className={styles.bodyTableCellWithBorder}>
          {row.TotalArea}
        </TableCell>
      </TableRow>
      {/* Render child rows if expanded */}
      {isExpanded && children}
    </React.Fragment>
  );
};

export default TreeTableRow;
