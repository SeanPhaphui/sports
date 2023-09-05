import { Box, Card } from "@mui/material";
import React from "react";
import {
    GameSelectionObject,
    extractTeamsFromGameSelection,
    extractTeamsFromPlayerBet,
} from "../../../Utils/Utils";
import "./SelectGameCard.css";
import UpcomingInfo from "../../../PlayerBetCard/UpcomingInfo/UpcomingInfo";

interface SelectGameCardProps {
    game: GameSelectionObject;
    openDialog: () => void;
}

const SelectGameCard: React.FC<SelectGameCardProps> = (props) => {
    const { game, openDialog } = props;

    const { homeTeam, awayTeam } = extractTeamsFromGameSelection(game);
    return (
        <div className="SelectGameCard">
            <Card onClick={openDialog}>
                <UpcomingInfo homeTeam={homeTeam} awayTeam={awayTeam} />
                <div className="spread">{"Current Spread: " + game.spread}</div>
            </Card>
        </div>
    );
};

export default SelectGameCard;
