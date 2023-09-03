import React from "react";
import "./SelectGameCardList.css";
import { createTheme, styled } from "@mui/material";
import { Slide } from "@mui/material";
import { GameSelectionObject } from "../Utils/Utils";
import SelectGameCardContainer from "./SelectGameCardContainer/SelectGameCardContainer";

interface SelectGameCardListProps {
    gameSelections: GameSelectionObject[];
    filterText: string;
    // updateContract: (contract: ContractObject) => void;
}

const SelectGameCardList: React.FC<SelectGameCardListProps> = (props) => {
    const { gameSelections, filterText } = props;

    return (
        <div className="SelectGameCardList">
            {gameSelections &&
                gameSelections
                    .filter((game) => game.name.toLowerCase().includes(filterText.toLowerCase())) // Apply filter
                    .map((game) => <SelectGameCardContainer key={game.id} game={game} />)}
        </div>
    );
};

export default SelectGameCardList;
