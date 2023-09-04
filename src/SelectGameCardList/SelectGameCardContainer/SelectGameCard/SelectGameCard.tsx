import { Box, Card } from "@mui/material";
import React from "react";
import {
    GameSelectionObject
} from "../../../Utils/Utils";
import "./SelectGameCard.css";

interface SelectGameCardProps {
    game: GameSelectionObject;
    openDialog: () => void;
}

const SelectGameCard: React.FC<SelectGameCardProps> = (props) => {
    const { game, openDialog } = props;

    return (
        <div className="SelectGameCard">
            <Card className="game-item" onClick={openDialog}>
                <div className="game-item-group">
                    <div className="team">
                        <Box
                            component="img"
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                marginRight: "10px",
                            }}
                            src={game.awayTeam.logo}
                        />
                        <div>{game.awayTeam.location}</div>
                    </div>
                    <div>{game.awayTeam.record}</div>
                </div>
                <div className="divider"></div>
                <div className="game-item-group">
                    <div className="team">
                        <Box
                            component="img"
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                marginRight: "10px",
                            }}
                            src={game.homeTeam.logo}
                        />
                        <div>{game.homeTeam.location}</div>
                    </div>
                    <div>{game.homeTeam.record}</div>
                </div>
            </Card>
        </div>
    );
};

export default SelectGameCard;
