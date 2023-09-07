import { KeyboardArrowDown } from "@mui/icons-material";
import { Box, Grow } from "@mui/material";
import React from "react";
import { PlayerBet, TeamInfo } from "../Utils/Utils";
import "./PlayerPicks.css";

export interface PlayerPicksProps {
    playerBets: PlayerBet[];
}

const PlayerPicks: React.FC<PlayerPicksProps> = (props) => {
    const { playerBets } = props;

    const getTeamInfo = (playerBet: PlayerBet) => {
        return playerBet.team === playerBet.homeTeam.location
            ? playerBet.homeTeam
            : playerBet.awayTeam;
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

    return (
        <div className="PlayerPicks">
            {playerBets.length >= 1 && (
                <div>
                    <div className="bets-top">PICKS</div>
                    <div className="bets-bar" style={gradientBackground}></div>
                    <div className="bets-bottom">
                        {playerBets.map((playerBet) => {
                            // Determine the teamInfo based on the team in playerBet
                            const teamInfo = getTeamInfo(playerBet);

                            // Create a tinted color by adjusting the alpha channel
                            const tintedColor = getTintedColor(teamInfo);

                            return (
                                <Grow in={true} timeout={500} key={playerBet.id}>
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
                    {/* <div className="bets">
                    <ListItemButton
                        alignItems="flex-start"
                        onClick={() => setOpen(!open)}
                        sx={{
                            px: 3,
                            pt: 2.5,
                            pb: open ? 0 : 2.5,
                            "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } },
                        }}
                    >
                        <ListItemText
                            primary="Picks: "
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: "medium",
                                lineHeight: "20px",
                                mb: "2px",
                            }}
                        />
                        <KeyboardArrowDown
                            sx={{
                                mr: -1,
                                opacity: 0,
                                transform: open ? "rotate(-180deg)" : "rotate(0)",
                                transition: "0.2s",
                            }}
                        />
                    </ListItemButton>
                </div> */}
                </div>
            )}
        </div>
    );
};

export default PlayerPicks;
