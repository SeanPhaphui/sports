import React from "react";
import "./SelectGameCardList.css";
import { createTheme, styled } from "@mui/material";
import { Slide } from "@mui/material";
import { GameSelectionObject } from "../Utils/Utils";
import SelectGameCardContainer from "./SelectGameCardContainer/SelectGameCardContainer";
import { BetObject } from "./SelectGameCardContainer/SelectGameCardDialog/SelectGameCardDialog";

interface SelectGameCardListProps {
    gameSelections: GameSelectionObject[];
    filterText: string;
    onAdd: (bet: BetObject) => void;
    // updateContract: (contract: ContractObject) => void;
}

const SelectGameCardList: React.FC<SelectGameCardListProps> = (props) => {
    const { gameSelections, filterText, onAdd } = props;

    return (
        <div className="SelectGameCardList">
            {gameSelections &&
                gameSelections
                    .filter((game) => game.name.toLowerCase().includes(filterText.toLowerCase())) // Apply filter
                    .map((game) => <SelectGameCardContainer key={game.id} game={game} onAdd={onAdd} />)}
        </div>
    );
};

export default SelectGameCardList;
