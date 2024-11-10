import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

// Sample JSON Data
const rowData = [
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
        RegionId: 1,
        Region: "Assam",
        LineFarm: 8,
        SheadArea: 127109,
        FeedArea: 226642,
        OpenArea: 225368,
        TotalArea: 568015,
        children: [
          {
            UnitId: 1,
            Unit: "Samastipur",
            LineFarm: 8,
            SheadArea: 127109,
            FeedArea: 226642,
            OpenArea: 225368,
            TotalArea: 568015,
          },
        ],
      },
      {
        RegionId: 2,
        Region: "Bihar",
        LineFarm: 10,
        SheadArea: 157109,
        FeedArea: 256642,
        OpenArea: 305368,
        TotalArea: 668015,
        children: [],
      },
      {
        RegionId: 3,
        Region: "Delhi",
        LineFarm: 12,
        SheadArea: 107109,
        FeedArea: 206642,
        OpenArea: 125368,
        TotalArea: 468015,
        children: [],
      },
    ],
  },
];

// Component to display nested lists with expandable regions and units
const TreeViewGrid = () => {
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderUnits = (units) => (
    <List component="div" disablePadding>
      {units.map((unit) => (
        <ListItem key={unit.UnitId} sx={{ pl: 4 }}>
          <ListItemText
            primary={<Typography>{`Unit: ${unit.Unit}`}</Typography>}
            secondary={
              <>
                <Typography>{`LineFarm: ${unit.LineFarm}`}</Typography>
                <Typography>{`SheadArea: ${unit.SheadArea}`}</Typography>
                <Typography>{`FeedArea: ${unit.FeedArea}`}</Typography>
                <Typography>{`OpenArea: ${unit.OpenArea}`}</Typography>
                <Typography>{`TotalArea: ${unit.TotalArea}`}</Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  const renderRegions = (regions) => (
    <List component="div" disablePadding>
      {regions.map((region) => (
        <div key={region.RegionId}>
          <ListItem button onClick={() => handleExpandClick(region.RegionId)}>
            <ListItemText primary={`Region: ${region.Region}`} />
            <IconButton>
              {expanded[region.RegionId] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse in={expanded[region.RegionId]} timeout="auto" unmountOnExit>
            {region.children && region.children.length > 0
              ? renderUnits(region.children)
              : "No Units"}
          </Collapse>
        </div>
      ))}
    </List>
  );

  const renderCompanies = (companies) => (
    <List>
      {companies.map((company) => (
        <div key={company.companyId}>
          <ListItem button onClick={() => handleExpandClick(company.companyId)}>
            <ListItemText primary={`Company: ${company.company}`} />
            <IconButton>
              {expanded[company.companyId] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse
            in={expanded[company.companyId]}
            timeout="auto"
            unmountOnExit
          >
            {renderRegions(company.children)}
          </Collapse>
        </div>
      ))}
    </List>
  );

  return <div>{renderCompanies(rowData)}</div>;
};

export default TreeViewGrid;
