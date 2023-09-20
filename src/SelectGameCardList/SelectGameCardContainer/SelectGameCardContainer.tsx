import React from "react";
import { Bet, Game } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";
import { Dialog, DialogTitle } from "@mui/material";
import SelectGameCardDialog from "./SelectGameCardDialog/SelectGameCardDialog";

interface SelectGameCardContainerProps {
    game: Game;
    handleAddBet: (bet: Bet) => void;
    allBetsForWeek: { uid: string; bets: Bet[]; displayName: string }[];
}

const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = ({ game, handleAddBet, allBetsForWeek}) => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAndAdd = (bet: Bet) => {
        handleAddBet(bet);
        setOpen(false);
    };

    return (
        <div>
            <SelectGameCard game={game} openDialog={handleClickOpen} allBetsForWeek={allBetsForWeek}/>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Place Bet</DialogTitle>
                <SelectGameCardDialog game={game} handleAddBet={handleCloseAndAdd}/>
            </Dialog>
        </div>
    );
};

export default SelectGameCardContainer;
