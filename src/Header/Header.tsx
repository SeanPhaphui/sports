import { Button, TextField } from "@mui/material";
import React from "react";
import "./Header.css";

interface HeaderProps {
    activeButton: string;
    setActiveButton: (button: string) => void;
    filterText: string;
    setFilterText: (text: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    activeButton,
    setActiveButton,
    filterText,
    setFilterText,
}) => {
    return (
        <div className="Header">
            <div className="buttons">
                <Button
                    style={{
                        color: activeButton === "Top 25" ? "white" : "#919293",
                        backgroundColor: activeButton === "Top 25" ? "#151617" : "#3a3b3c",
                        textTransform: "none",
                    }}
                    onClick={() => setActiveButton("Top 25")}
                >
                    Top 25
                </Button>
                <div className="divider"></div>
                <Button
                    style={{
                        color: activeButton === "FBS (I-A)" ? "white" : "#919293",
                        backgroundColor: activeButton === "FBS (I-A)" ? "#151617" : "#3a3b3c",
                    }}
                    onClick={() => setActiveButton("FBS (I-A)")}
                >
                    FBS (I-A)
                </Button>
            </div>
            <TextField
                size="small"
                label="Search"
                value={filterText}
                onChange={(event) => setFilterText(event.target.value)}
            />
        </div>
    );
};

export default Header;
