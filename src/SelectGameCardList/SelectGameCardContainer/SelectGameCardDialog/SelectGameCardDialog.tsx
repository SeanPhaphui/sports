import React, { ChangeEvent, useEffect, useState } from "react";
import { Bet, Game, getGameByGameID } from "../../../Utils/Utils";
import TeamPicker from "./TeamPicker/TeamPicker";
import { Collapse, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SpreadSign from "./SpreadSign/SpreadSign";
import AddBet from "./AddBet/AddBet";
import { TransitionGroup } from "react-transition-group";
import "./SelectGameCardDialog.css";
import OverUnder from "./OverUnder/OverUnder";

interface SelectGameCardDialogProps {
    game: Game;
    handleAddBet: (bet: Bet) => void;
}

const SelectGameCardDialog: React.FC<SelectGameCardDialogProps> = ({ game, handleAddBet }) => {
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
    const [overUnder, setOverUnder] = useState<string>("");
    const [disableAddBet, setDisableAddBet] = useState<boolean>(true);
    const [defaultTextValue, setDefaultTextValue] = useState<string>("");
    const [betType, setBetType] = useState<"spread" | "over" | "under" | undefined>("spread");
    const [betValue, setBetValue] = useState<string>();
    const [betSelection, setBetSelection] = useState<string>("Spread");



    const inputProps = {
        type: "tel",
        pattern: "-?[0-9]*\\.?[0-9]+",
        inputmode: "decimal",
    };

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        if (newAlignment !== null) {
            setBetSelection(newAlignment);
        }
    };

    const handleBetValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBetValue(e.target.value);
        setDefaultTextValue(e.target.value);
    };

    useEffect(() => {
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
            const teamAbbreviation = extractSpreadDetails(game.odds.spread)?.teamAbbreviation;
            const spreadSignValue = extractSpreadDetails(game.odds.spread)?.spreadSign || "+"; // Defaults to positive if no sign captured
            const spreadValue = extractSpreadDetails(game.odds.spread)?.spreadValue;

            setSpreadSign(spreadSignValue);
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
            console.log("BET BUILDER: ", bet)
            handleAddBet(bet);
        }
    };

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
                        <ToggleButton className="left-toggle-button" value="Spread">
                            Spread
                        </ToggleButton>
                        <ToggleButton className="right-toggle-button" value="Over/Under">
                            Over/Under
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <TransitionGroup>
                {betSelection === "Spread" && (
                    <Collapse in={true}>
                        <div className="item">
                            <TeamPicker
                                homeTeam={game.homeTeam.location}
                                awayTeam={game.awayTeam.location}
                                team={team}
                                onTeamChange={(team: string) => setTeam(team)}
                            />
                        </div>
                    </Collapse>
                )}
            </TransitionGroup>
            <div className="item">
                <TextField
                    label={betSelection}
                    InputProps={{
                        inputProps: inputProps,
                    }}
                    value={defaultTextValue} // Changed this line
                    onChange={handleBetValueChange}
                />
            </div>
            <TransitionGroup>
                {betSelection === "Spread" && (
                    <Collapse in={true}>
                        <div className="item">
                            <SpreadSign
                                onSpreadSignChange={setSpreadSign}
                                spreadSign={spreadSign}
                            />
                        </div>
                    </Collapse>
                )}
            </TransitionGroup>
            <TransitionGroup>
                {betSelection !== "Spread" && (
                    <Collapse in={true}>
                        <div className="item">
                            <OverUnder
                                onOverUnderChange={setBetType}
                            />
                        </div>
                    </Collapse>
                )}
            </TransitionGroup>
            <div className="item">
                <AddBet disabled={disableAddBet} onAddBetChange={() => buildBet()} />
            </div>
        </div>
    );
};

export default SelectGameCardDialog;
