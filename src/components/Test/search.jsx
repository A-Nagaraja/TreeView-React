import { Search } from "@mui/icons-material";
import styles from "../../styles/treeView.module.css";

const SearchGrid = ({ searchTerm, onSearch }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Search className={styles.searchIcon} />
      </div>

      <input
        id="search"
        name="search"
        type="search"
        placeholder="Search"
        value={searchTerm}
        style={{
          width: "18vw",
          height: "5vh",
          alignSelf: "flex-end",
          borderColor: "#c2c0ba",
          borderWidth: 1,
          borderRadius: 5,
          padding: "8px", // Add padding for better spacing inside the input
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding a subtle shadow
          outline: "none", // Removes the default focus outline
          borderStyle: "solid", // Ensures the border is solid
          transition: "box-shadow 0.3s ease-in-out", // For smooth shadow transition on focus
          backgroundColor: "#ffffff", // Explicitly set background color to white
          color: "#000000", // Explicitly set the text color to black
        }}
        onFocus={(e) =>
          (e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)")
        }
        onBlur={(e) =>
          (e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)")
        }
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchGrid;
