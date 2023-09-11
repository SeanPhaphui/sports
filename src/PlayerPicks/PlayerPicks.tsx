import { KeyboardArrowDown } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Avatar,
    Box,
    Collapse,
    Fade,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { Bet, TeamInfo } from "../Utils/Utils";
import "./PlayerPicks.css";

export interface PlayerPicksProps {
    playerBets: Bet[];
    handleRemoveBet: (item: Bet) => void;
}

const PlayerPicks: React.FC<PlayerPicksProps> = ({ playerBets, handleRemoveBet }) => {
    const getTeamInfo = (playerBet: Bet) => {
        return playerBet.team === playerBet.game.homeTeam.location
            ? playerBet.game.homeTeam
            : playerBet.game.awayTeam;
    };

    const getOpponentTeamInfo = (playerBet: Bet) => {
        return playerBet.team !== playerBet.game.homeTeam.location
            ? playerBet.game.homeTeam
            : playerBet.game.awayTeam;
    };

    const getTintedColor = (teamInfo: TeamInfo) => {
        const tintOpacity = 0.5;
        return (
            teamInfo.color +
            Math.round(tintOpacity * 255)
                .toString(16)
                .padStart(2, "0")
        );
    };

    const gradientBackground =
        playerBets.length === 1
            ? {
                  background: `linear-gradient(to right, black, ${
                      getTeamInfo(playerBets[0]).color
                  }, black)`,
                  animation: "pulsateBar 4s infinite",
              }
            : {
                  background: `linear-gradient(to right, ${playerBets
                      .map((playerBet) => getTeamInfo(playerBet).color)
                      .join(", ")})`,
                  animation: "pulsateBar 4s infinite",
              };

    const renderItem = (playerBet: Bet) => {
        const teamInfo = getTeamInfo(playerBet);
        const opponentTeamInfo = getOpponentTeamInfo(playerBet);
        const tintedColor = getTintedColor(teamInfo);
        return (
            <ListItem
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        title="Delete"
                        onClick={() => handleRemoveBet(playerBet)}
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: tintedColor }} src={teamInfo.logo} />
                </ListItemAvatar>
                <ListItemText
                    primary={`${playerBet.team}: ${playerBet.spread}`}
                    secondary={`vs ${opponentTeamInfo.location}`}
                />
            </ListItem>
        );
    };

    const [playerView, setPlayerView] = useState<boolean>(true);

    const handleViewChange = () => {
        playerView ? setPlayerView(false) : setPlayerView(true);
    };

    const [isVisible, setIsVisible] = useState(true);

    let shown: boolean;
    if (playerBets.length >= 1) {
        shown = true;
    } else {
        shown = false;
    }

    return (
        <TransitionGroup>
            {playerBets.length >= 1 && (
                <Collapse in={shown}>
                    <div className="PlayerPicks">
                        <Grow in={true} timeout={1000}>
                            <div>
                                <div className="bets-top">
                                    <div className="left">PICKS</div>
                                    <KeyboardArrowDown
                                        fontSize="medium"
                                        className="right"
                                        onClick={handleViewChange}
                                        sx={{
                                            transform: !playerView
                                                ? "rotate(-180deg)"
                                                : "rotate(0)",
                                            transition: "0.2s",
                                        }}
                                    />
                                </div>
                                <div className="bets-bar" style={gradientBackground}></div>
                                <div className="bets-bottom">
                                    <div
                                        className={
                                            playerView ? "bets-bottom-logo" : "bets-bottom-list"
                                        }
                                    >
                                        {playerView ? (
                                            <div>
                                                {playerBets.map((playerBet) => {
                                                    // Determine the teamInfo based on the team in playerBet
                                                    const teamInfo = getTeamInfo(playerBet);

                                                    // Create a tinted color by adjusting the alpha channel
                                                    const tintedColor = getTintedColor(teamInfo);

                                                    return (
                                                        <Grow
                                                            in={true}
                                                            timeout={1000}
                                                            key={playerBet.id}
                                                        >
                                                            <Box
                                                                component="img"
                                                                sx={{
                                                                    padding: "10px",
                                                                    height: "3vh",
                                                                    width: "3vh",
                                                                    mx: "5px",
                                                                    backgroundColor: tintedColor, // Use the tinted color as the background
                                                                    borderRadius: "100%",
                                                                }}
                                                                src={teamInfo.logo} // Use the logo from teamInfo
                                                            />
                                                        </Grow>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="testing">
                                                <Fade in={true} timeout={500}>
                                                    <List>
                                                        <TransitionGroup>
                                                            {playerBets.map((playerBet) => (
                                                                <Collapse key={playerBet.id}>
                                                                    {renderItem(playerBet)}
                                                                </Collapse>
                                                            ))}
                                                        </TransitionGroup>
                                                    </List>
                                                </Fade>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Grow>
                    </div>
                </Collapse>
            )}
        </TransitionGroup>
    );
};

export default PlayerPicks;
