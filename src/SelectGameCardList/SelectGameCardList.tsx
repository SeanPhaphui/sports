import React from "react";
import "./SelectGameCardList.css";
import { createTheme, styled } from "@mui/material";
import { Slide } from "@mui/material";
import { Bet, BetObject, GameSelectionObject } from "../Utils/Utils";
import SelectGameCardContainer from "./SelectGameCardContainer/SelectGameCardContainer";

interface SelectGameCardListProps {
    gameSelections: GameSelectionObject[];
    filterText: string;
    handleAddBet: (bet: Bet) => void;
    // updateContract: (contract: ContractObject) => void;
}

const SelectGameCardList: React.FC<SelectGameCardListProps> = (props) => {
    const { gameSelections, filterText, handleAddBet } = props;

    const sortedGameSelections = [...gameSelections].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : 0;
        const dateB = b.date instanceof Date ? b.date.getTime() : 0;
        return dateA - dateB;
    });
    

    return (
        <div className="SelectGameCardList">
            {sortedGameSelections &&
                sortedGameSelections
                    .filter((game) =>
                        game.eventName.toLowerCase().includes(filterText.toLowerCase())
                    ) // Apply filter
                    .map((game) => (
                        <SelectGameCardContainer key={game.id} game={game} handleAddBet={handleAddBet} />
                    ))}
        </div>
    );
};

export default SelectGameCardList;
