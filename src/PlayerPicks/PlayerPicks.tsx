import { KeyboardArrowDown } from "@mui/icons-material";
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
import { Bet, PlayerBet, TeamInfo } from "../Utils/Utils";
import "./PlayerPicks.css";
import { TransitionGroup } from "react-transition-group";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

export interface PlayerPicksProps {
    playerBets: Bet[];
    handleRemoveBet: (item: Bet) => void;
}

const PlayerPicks: React.FC<PlayerPicksProps> = (props) => {
    const { playerBets, handleRemoveBet } = props;

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
        const tintedColor =
            teamInfo.color +
            Math.round(tintOpacity * 255)
                .toString(16)
                .padStart(2, "0");
        return tintedColor;
    };

    // const [open, setOpen] = React.useState(true);

    let gradientBackground;

    if (playerBets.length === 1) {
        // When there's only one playerBet, create a specific gradient
        const teamInfo = getTeamInfo(playerBets[0]);
        const singlePlayerBetGradient = `black, ${teamInfo.color}, black`;
        gradientBackground = {
            background: `linear-gradient(to right, ${singlePlayerBetGradient})`,
            animation: "pulsateBar 4s infinite",
        };
    } else {
        // When there are multiple playerBets, calculate the gradient normally
        const gradientColors = playerBets.map((playerBet) => {
            const teamInfo = getTeamInfo(playerBet);
            return teamInfo.color;
        });
        const gradientColorString = gradientColors.join(", ");
        gradientBackground = {
            background: `linear-gradient(to right, ${gradientColorString})`,
            animation: "pulsateBar 4s infinite",
        };
    }

    interface RenderItemOptions {
        playerBet: Bet;
    }

    function renderItem({ playerBet }: RenderItemOptions) {
        // Determine the teamInfo based on the team in playerBet
        const teamInfo = getTeamInfo(playerBet);

        // Determine the teamInfo based on the team in playerBet
        const opponentTeamInfo = getOpponentTeamInfo(playerBet);

        // Create a tinted color by adjusting the alpha channel
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
                    <Avatar
                        sx={{
                            backgroundColor: tintedColor, // Use the tinted color as the background
                        }}
                        src={teamInfo.logo}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`${playerBet.team}: ${playerBet.spread}`}
                    secondary={`vs ${opponentTeamInfo.location}`}
                />
            </ListItem>
        );
    }

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
                                        transform: !playerView ? "rotate(-180deg)" : "rotate(0)",
                                        transition: "0.2s",
                                    }}
                                />
                            </div>
                            <div className="bets-bar" style={gradientBackground}></div>
                            <div className={playerView ? "bets-bottom-logo" : "bets-bottom-list"}>
                                {playerView ? (
                                    <div>
                                        {playerBets.map((playerBet) => {
                                            // Determine the teamInfo based on the team in playerBet
                                            const teamInfo = getTeamInfo(playerBet);

                                            // Create a tinted color by adjusting the alpha channel
                                            const tintedColor = getTintedColor(teamInfo);

                                            return (
                                                <Grow in={true} timeout={1000} key={playerBet.id}>
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
                                                            {renderItem({ playerBet })}
                                                        </Collapse>
                                                    ))}
                                                </TransitionGroup>
                                            </List>
                                        </Fade>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Grow>
            
        </div>
            </Collapse>
    );
};

export default PlayerPicks;
