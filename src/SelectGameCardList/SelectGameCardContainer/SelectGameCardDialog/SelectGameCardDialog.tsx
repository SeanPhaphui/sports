import { Collapse, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { Bet, Game, getGameByGameID } from "../../../Utils/Utils";
import AddBet from "./AddBet/AddBet";
import OverUnder from "./OverUnder/OverUnder";
import "./SelectGameCardDialog.css";
import SpreadSign from "./SpreadSign/SpreadSign";
import TeamPicker from "./TeamPicker/TeamPicker";

interface SelectGameCardDialogProps {
    game: Game;
    handleAddBet: (bet: Bet) => void;
    allBetsForWeek: { uid: string; bets: Bet[]; displayName: string }[];
}

const SelectGameCardDialog: React.FC<SelectGameCardDialogProps> = ({
    game,
    handleAddBet,
    allBetsForWeek,
}) => {
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

    const disabledTeams = betsForCurrentGame.map((bet) => bet.team);
    const disabledOverUnders = betsForCurrentGame
        .filter((bet) => bet.type === "over" || bet.type === "under")
        .map((bet) => bet.type);

    const extractSpreadDetails = (spread: string) => {
        const spreadPattern = /([A-Z]+)\s*([-+]?)\s*([\d.]+)/;
        const spreadMatch = spread.match(spreadPattern);
        if (spreadMatch) {
            return {
                teamAbbreviation: spreadMatch[1],
                spreadSign: spreadMatch[2] || "+",
                spreadValue: spreadMatch[3],
            };
        }
        return null;
    };
    const initialTeam =
        extractSpreadDetails(game.odds.spread)?.teamAbbreviation === game.homeTeam.abbreviation
            ? game.homeTeam.location
            : extractSpreadDetails(game.odds.spread)?.teamAbbreviation ===
              game.awayTeam.abbreviation
            ? game.awayTeam.location
            : undefined;
    const [team, setTeam] = useState<string | undefined>(initialTeam);

    const initialSpreadSign =
        game.odds.spread === "N/A" ? "" : game.odds.spread.includes("-") ? "-" : "+";
    const [spreadSign, setSpreadSign] = useState<string>(initialSpreadSign);
    const [disableAddBet, setDisableAddBet] = useState<boolean>(true);
    const [defaultTextValue, setDefaultTextValue] = useState<string>("");
    const [betType, setBetType] = useState<"spread" | "over" | "under" | undefined>("spread");
    const [betValue, setBetValue] = useState<string>();
    const [betSelection, setBetSelection] = useState<string>(
        disabledTeams.includes(game.homeTeam.location) &&
            disabledTeams.includes(game.awayTeam.location)
            ? "Over/Under"
            : "Spread"
    );

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        if (newAlignment !== null) {
            setBetSelection(newAlignment);
        }
    };

    useEffect(() => {
        const spreadDetails = extractSpreadDetails(game.odds.spread);
        if (betSelection === "Over/Under") {
            setBetType(undefined);
            const newDefaultValue = game.odds.overUnder === "N/A" ? "" : game.odds.overUnder;
            if (defaultTextValue !== newDefaultValue) {
                setDefaultTextValue(newDefaultValue);
            }
            if (game.odds.overUnder !== "N/A") {
                setBetValue(game.odds.overUnder);
            }
            setTeam(`${game.awayTeam.location}\\${game.homeTeam.location}`);
        } else {
            if (spreadDetails) {
                const { teamAbbreviation, spreadSign, spreadValue } = spreadDetails;
                // Now use these variables instead of calling extractSpreadDetails multiple times

                setSpreadSign(spreadSign);
                if (spreadValue) {
                    setDefaultTextValue(spreadValue);
                } else {
                    setDefaultTextValue("");
                }
                setBetValue(spreadValue);

                // Check for teamAbbreviation match and set the team location
                if (teamAbbreviation === game.homeTeam.abbreviation) {
                    setTeam(game.homeTeam.location);
                } else if (teamAbbreviation === game.awayTeam.abbreviation) {
                    setTeam(game.awayTeam.location);
                } else {
                    setTeam(undefined); // reset the team state if no match
                }
            }
            setBetType("spread");
        }
    }, [betSelection]);

    useEffect(() => {
        if (team && betType && betValue) {
            setDisableAddBet(false);
        } else {
            setDisableAddBet(true);
        }
    }, [team, betType, betValue]);

    const buildBet = async () => {
        if (team && betType && betValue) {
            const adjustedBetValue = betType === "spread" ? spreadSign + betValue : betValue;
            const bet: Bet = await getGameByGameID(game.gameId, team, betType, adjustedBetValue);
            handleAddBet(bet);
        }
    };

    const setTeamAndAdjustSpread = (selectedTeam: string) => {
        // Logic to invert the spread based on the selected team
        const initialTeamDetails = extractSpreadDetails(game.odds.spread);

        if (initialTeamDetails) {
            const initialTeamAbbreviation = initialTeamDetails.teamAbbreviation;
            const initialTeamLocation =
                initialTeamAbbreviation === game.homeTeam.abbreviation
                    ? game.homeTeam.location
                    : game.awayTeam.location;

            if (selectedTeam !== initialTeamLocation) {
                // Invert the spread sign if the selected team is opposite to the initial team
                setSpreadSign(initialTeamDetails.spreadSign === "+" ? "-" : "+");
            } else {
                // Set to the initial spread sign otherwise
                setSpreadSign(initialTeamDetails.spreadSign);
            }
        }

        // Update the selected team
        setTeam(selectedTeam);
    };

    useEffect(() => {
        const shouldSwitchToOverUnder = disabledTeams.includes(game.homeTeam.location) &&
                                         disabledTeams.includes(game.awayTeam.location);
        
        const shouldSwitchToSpread = disabledOverUnders.includes("over") &&
                                     disabledOverUnders.includes("under");
    
        if (shouldSwitchToOverUnder && betSelection !== "Over/Under") {
            setBetSelection("Over/Under");
        } else if (shouldSwitchToSpread && betSelection !== "Spread") {
            setBetSelection("Spread");
        }
    }, [disabledTeams, disabledOverUnders, game.homeTeam.location, game.awayTeam.location, betSelection]);
    

    return (
        <div className="SelectGameCardDialog">
            <div className="item">
                <div className="TeamPicker">
                    <ToggleButtonGroup
                        color="primary"
                        fullWidth
                        value={betSelection}
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton
                            className="left-toggle-button"
                            value="Spread"
                            disabled={
                                disabledTeams.includes(game.homeTeam.location) &&
                                disabledTeams.includes(game.awayTeam.location)
                            }
                        >
                            Spread
                        </ToggleButton>
                        <ToggleButton
                            className="right-toggle-button"
                            value="Over/Under"
                            disabled={
                                disabledOverUnders.includes("over") &&
                                disabledOverUnders.includes("under")
                            }
                        >
                            Over/Under
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>

            {betSelection === "Spread" && (
                <div className="item">
                    <TeamPicker
                        homeTeam={game.homeTeam.location}
                        awayTeam={game.awayTeam.location}
                        team={team}
                        onTeamChange={setTeamAndAdjustSpread}
                        disabledOptions={disabledTeams}
                    />
                </div>
            )}

            {betSelection !== "Spread" && (
                <div className="item">
                    <OverUnder
                        onOverUnderChange={setBetType}
                        disabledOptions={disabledOverUnders}
                    />
                </div>
            )}

            <div className="item">
                {betSelection === "Spread" ? (
                    <Typography variant="body1" gutterBottom>
                        {betSelection}: {spreadSign}
                        {defaultTextValue}
                    </Typography>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        {betSelection}: {defaultTextValue}
                    </Typography>
                )}
            </div>

            <div className="item">
                <AddBet disabled={disableAddBet} onAddBetChange={() => buildBet()} />
            </div>
        </div>
    );
};

export default SelectGameCardDialog;
