import { KeyboardArrowDown } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from '@mui/icons-material/Lock';
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
    betLock: boolean;
}

const PlayerPicks: React.FC<PlayerPicksProps> = ({ playerBets, handleRemoveBet, betLock }) => {
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
                  background:
                      playerBets[0].type === "over" || playerBets[0].type === "under"
                          ? `linear-gradient(to right, black, ${playerBets[0].game.awayTeam.color}, ${playerBets[0].game.homeTeam.color}, black)`
                          : `linear-gradient(to right, black, ${
                                getTeamInfo(playerBets[0]).color
                            }, black)`,
                  animation: "pulsateBar 4s infinite",
              }
            : {
                  background: `linear-gradient(to right, ${playerBets
                      .map((playerBet) =>
                          playerBet.type === "over" || playerBet.type === "under"
                              ? [playerBet.game.awayTeam.color, playerBet.game.homeTeam.color]
                              : getTeamInfo(playerBet).color
                      )
                      .flat()
                      .join(", ")})`,
                  animation: "pulsateBar 4s infinite",
              };

    const renderItem = (bet: Bet) => {
        const teamInfo = getTeamInfo(bet);
        const opponentTeamInfo = getOpponentTeamInfo(bet);
        const teamTintedColor = getTintedColor(teamInfo);
        const opponentTintedColor = getTintedColor(opponentTeamInfo);

        return (
            <ListItem
                secondaryAction={
                    betLock ? ( // Check if bets are locked
                    <IconButton
                        edge="end"
                        aria-label="lock"
                        title="Lock"
                    >
                        <LockIcon />
                    </IconButton>
                ) : ( // Check if bets are locked
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            title="Delete"
                            onClick={() => handleRemoveBet(bet)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )
                }
            >
                {bet.type === "spread" ? (
                    <div className="list">
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    backgroundColor: teamTintedColor,
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for elevated effect
                                }}
                                src={teamInfo.logo}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Spread: ${bet.team} ${bet.value}`}
                            secondary={`${bet.game.awayTeam.abbreviation} vs ${bet.game.homeTeam.abbreviation}`}
                        />
                    </div>
                ) : (
                    <div className="list">
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    background: `linear-gradient(to right, ${teamTintedColor}, ${opponentTintedColor})`, // Gradient from team to opponent color
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for elevated effect
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {/* Container for the logos */}
                                <Box
                                    sx={{
                                        width: "75%",
                                        height: "75%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {/* First logo */}
                                    <Box
                                        component="img"
                                        sx={{
                                            height: "100%",
                                            width: "50%", // Each logo takes up half the width
                                            objectFit: "contain", // Ensure the logo isn't distorted
                                        }}
                                        src={teamInfo.logo}
                                    />

                                    {/* Second logo */}
                                    <Box
                                        component="img"
                                        sx={{
                                            height: "100%",
                                            width: "50%",
                                            objectFit: "contain",
                                        }}
                                        src={opponentTeamInfo.logo}
                                    />
                                </Box>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                bet.type.charAt(0).toUpperCase() +
                                bet.type.slice(1) +
                                ": " +
                                bet.value
                            }
                            secondary={`${bet.game.awayTeam.abbreviation} vs ${bet.game.homeTeam.abbreviation}`}
                        />
                    </div>
                )}
            </ListItem>
        );
    };

    const [isLogoView, setIsLogoView] = useState<boolean>(true);

    const handleViewChange = () => {
        isLogoView ? setIsLogoView(false) : setIsLogoView(true);
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
                                    <div className="left">Your Picks</div>
                                    <KeyboardArrowDown
                                        fontSize="medium"
                                        className="right"
                                        onClick={handleViewChange}
                                        sx={{
                                            transform: !isLogoView
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
                                            isLogoView ? "bets-bottom-logo" : "bets-bottom-list"
                                        }
                                    >
                                        {isLogoView ? (
                                            <div className="logo2">
                                                {playerBets.map((playerBet) => {
                                                    // Determine the teamInfo based on the team in playerBet
                                                    const teamInfo = getTeamInfo(playerBet);
                                                    const opponentTeamInfo =
                                                        getOpponentTeamInfo(playerBet);
                                                    // Create a tinted color by adjusting the alpha channel
                                                    const tintedColor = getTintedColor(teamInfo);

                                                    return (
                                                        <Grow
                                                            in={true}
                                                            timeout={1000}
                                                            key={playerBet.id}
                                                        >
                                                            {playerBet.type === "spread" ? (
                                                                <Box
                                                                    component="img"
                                                                    sx={{
                                                                        padding: "10px",
                                                                        height: "3vh",
                                                                        width: "3vh",
                                                                        mx: "5px",
                                                                        backgroundColor:
                                                                            tintedColor, // Use the tinted color as the background
                                                                        borderRadius: "100%",
                                                                        boxShadow:
                                                                            "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for elevated effect
                                                                    }}
                                                                    src={teamInfo.logo} // Use the logo from teamInfo
                                                                />
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        padding: "10px",
                                                                        height: "3vh",
                                                                        width: "3vh",
                                                                        mx: "5px",
                                                                        background: `linear-gradient(to right, ${getTintedColor(
                                                                            teamInfo
                                                                        )}, ${getTintedColor(
                                                                            opponentTeamInfo
                                                                        )})`, // Split gradient between team and opponent
                                                                        borderRadius: "100%",
                                                                        boxShadow:
                                                                            "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for elevated effect
                                                                        display: "flex", // Use flex to layout children (the two logos) side by side
                                                                        justifyContent: "center", // Center the logos horizontally
                                                                        alignItems: "center", // Center the logos vertically
                                                                    }}
                                                                >
                                                                    {/* Container for the logos */}
                                                                    <Box
                                                                        sx={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            display: "flex",
                                                                            justifyContent:
                                                                                "space-between",
                                                                        }}
                                                                    >
                                                                        {/* First logo */}
                                                                        <Box
                                                                            component="img"
                                                                            sx={{
                                                                                height: "100%",
                                                                                width: "50%", // Each logo takes up half the width
                                                                                objectFit:
                                                                                    "contain", // Ensure the logo isn't distorted
                                                                            }}
                                                                            src={teamInfo.logo} // Use the first logo source
                                                                        />

                                                                        {/* Second logo */}
                                                                        <Box
                                                                            component="img"
                                                                            sx={{
                                                                                height: "100%",
                                                                                width: "50%",
                                                                                objectFit:
                                                                                    "contain",
                                                                            }}
                                                                            src={
                                                                                opponentTeamInfo.logo
                                                                            } // Use the second logo source
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            )}
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
