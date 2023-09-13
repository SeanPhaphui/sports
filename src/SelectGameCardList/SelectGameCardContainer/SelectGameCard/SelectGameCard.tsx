import { Box, Card, Divider, Typography } from "@mui/material";
import React from "react";
import { Game, extractTeamsFromGame, extractTeamsFromPlayerBet } from "../../../Utils/Utils";
import "./SelectGameCard.css";
import UpcomingInfo from "../../../PlayerBetCard/UpcomingInfo/UpcomingInfo";
import Info from "../../../PlayerBetCard/Info/Info";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface SelectGameCardProps {
  game: Game;
  openDialog: () => void;
}

const SelectGameCard: React.FC<SelectGameCardProps> = (props) => {
  const { game, openDialog } = props;

  const { homeTeam, awayTeam } = extractTeamsFromGame(game);
  return (
    <div className="SelectGameCard">
      <Card onClick={openDialog}>
        {game.status === "upcoming" && (
          <Box className="time" sx={{ display: "flex", alignItems: "center" }}>
            <ScheduleIcon />
            <Typography
              sx={{ fontSize: 12, ml: "5px", mt: "1px" }}
            >
              {game.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Typography>
          </Box>
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
        {game.status === "final" ? (
          <Info homeTeam={homeTeam} awayTeam={awayTeam} showRecord={true} showTotal={false}/>
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
