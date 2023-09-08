import React, { ChangeEvent, useEffect, useState } from "react";
import { Bet, BetObject, GameSelectionObject, getGameByGameID } from "../../../Utils/Utils";
import TeamPicker from "./TeamPicker/TeamPicker";
import "./SelectGameCardDialog.css";
import { TextField } from "@mui/material";
import SpreadSign from "./SpreadSign/SpreadSign";
import AddSpread from "./AddSpread/AddSpread";
import { v4 as uuidv4 } from "uuid";

interface SelectGameCardDialogProps {
    game: GameSelectionObject;
    handleAddBet: (bet: Bet) => void;
}

const SelectGameCardDialog: React.FC<SelectGameCardDialogProps> = (props) => {
    const { game, handleAddBet } = props;

    const [team, setTeam] = useState<string>();
    const [spread, setSpread] = useState<string>();
    const [spreadSign, setSpreadSign] = useState<string>();
    const [disableAddSpread, setDisableAddSpread] = useState<boolean>(true);

    useEffect(() => {
        if (team && spread && spreadSign) {
            setDisableAddSpread(false);
        } else {
            setDisableAddSpread(true);
        }
    }, [team, spread, spreadSign]);

    const handleSpreadSignUpdate = (spreadSign: string) => {
        setSpreadSign(spreadSign);
    };

    const inputProps = {
        type: "tel",
        pattern: "-?[0-9]*\\.?[0-9]+",
        inputmode: "decimal",
    };

    const buildBet = async () => {
        if (team && spread && spreadSign) {
            const bet: Bet = await getGameByGameID(game.id, team, spreadSign + spread);
            handleAddBet(bet);
        }
    };

    return (
        <div className="SelectGameCardDialog">
            <div className="item">
                <TeamPicker
                    homeTeam={game.homeTeam.location}
                    awayTeam={game.awayTeam.location}
                    onTeamChange={(team: string) => setTeam(team)}
                />
            </div>
            <div className="item">
                <TextField
                    label="Spread"
                    InputProps={{
                        inputProps: inputProps,
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSpread(e.target.value)}
                />
            </div>
            <div className="item">
                <SpreadSign onSpreadSignChange={handleSpreadSignUpdate} />
            </div>
            <div className="item">
                <AddSpread
                    spread={spread}
                    spreadSign={spreadSign}
                    disabled={disableAddSpread}
                    onAddSpreadChange={() => buildBet()}
                />
            </div>
        </div>
    );
};

export default SelectGameCardDialog;
