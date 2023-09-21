import LinkIcon from "@mui/icons-material/Link";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Avatar, Box, Card, Divider, Typography } from "@mui/material";
import React from "react";
import Info from "../../../PlayerBetCard/Info/Info";
import UpcomingInfo from "../../../PlayerBetCard/UpcomingInfo/UpcomingInfo";
import { Bet, Game, extractTeamsFromGame, getLetter } from "../../../Utils/Utils";
import "./SelectGameCard.css";

interface SelectGameCardProps {
    game: Game;
    openDialog: () => void;
    allBetsForWeek: { uid: string; bets: Bet[]; displayName: string }[];
}

const SelectGameCard: React.FC<SelectGameCardProps> = ({ game, openDialog, allBetsForWeek }) => {
    const { homeTeam, awayTeam } = extractTeamsFromGame(game);
    // Extracting all bets for the current game
    const betsForCurrentGame = allBetsForWeek
        .flatMap((userBets) =>
            userBets.bets.map((bet) => ({
                ...bet,
                uid: userBets.uid,
                displayName: userBets.displayName,
            }))
        )
        .filter((bet) => bet.game.gameId === game.gameId);
    return (
        <div className="SelectGameCard">
            <Card onClick={openDialog}>
                {game.status === "upcoming" && (
                    <div>
                        {betsForCurrentGame.length > 0 && (
                            <div>
                                <div className="BetsForGame">
                                    {betsForCurrentGame.map((bet, index) => (
                                        <div className="player" key={index}>
                                            {bet.type === "spread" ? (
                                                <div>
                                                    {`${bet.displayName} - Spread: ${bet.team} ${bet.value}`}
                                                </div>
                                            ) : (
                                                <div>
                                                    {bet.displayName +
                                                        " - " +
                                                        bet.type.charAt(0).toUpperCase() +
                                                        bet.type.slice(1) +
                                                        ": " +
                                                        bet.value}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Divider className="info-divider" />
                            </div>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div className="time">
                                <ScheduleIcon />
                                <Typography sx={{ fontSize: 12, ml: "5px", mt: "1px" }}>
                                    {game.date.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                            </div>
                            <a
                                href={game.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="external-link">
                                    <LinkIcon />
                                </div>
                            </a>
                        </Box>
                    </div>
                )}
                {game.status === "ongoing" && (
                    <div>
                        <div className="live-status">
                            <a href={game.link} target="_blank" rel="noopener noreferrer">
                                <LiveTvIcon />
                            </a>
                            <div className="status-detail">{game.statusDetail}</div>
                        </div>
                        <Divider className="info-divider" />
                    </div>
                )}
                {game.status === "final" || game.status === "ongoing" ? (
                    <Info
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        showRecord={true}
                        showTotal={false}
                    />
                ) : (
                    <div>
                        <UpcomingInfo homeTeam={homeTeam} awayTeam={awayTeam} />
                        <div className="extra-info">
                            <div>{"Current Spread: " + game.odds.spread}</div>
                            <div>{"Over/Under: " + game.odds.overUnder}</div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SelectGameCard;
