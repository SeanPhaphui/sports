import React from "react";
import { Bet, BetObject, GameSelectionObject } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";
import { Dialog, DialogTitle } from "@mui/material";
import SelectGameCardDialog from "./SelectGameCardDialog/SelectGameCardDialog";

interface SelectGameCardContainerProps {
    game: GameSelectionObject;
    handleAddBet: (bet: Bet) => void;
}

const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = (props) => {
    const { game, handleAddBet } = props;

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
            <SelectGameCard game={game} openDialog={handleClickOpen}/>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Pick Team & Spread</DialogTitle>
                <SelectGameCardDialog game={game} handleAddBet={handleCloseAndAdd}/>
            </Dialog>
        </div>
    );
};

export default SelectGameCardContainer;