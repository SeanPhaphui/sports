import React from "react";
import { GameSelectionObject } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";
import { Dialog, DialogTitle } from "@mui/material";
import SelectGameCardDialog, { BetObject } from "./SelectGameCardDialog/SelectGameCardDialog";

interface SelectGameCardContainerProps {
    game: GameSelectionObject;
    onAdd: (bet: BetObject) => void;
}

const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = (props) => {
    const { game, onAdd } = props;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAndAdd = (bet: BetObject) => {
        onAdd(bet);
        setOpen(false);
    };

    return (
        <div>
            <SelectGameCard game={game} openDialog={handleClickOpen}/>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Pick Team & Spread</DialogTitle>
                <SelectGameCardDialog game={game} onAdd={handleCloseAndAdd}/>
            </Dialog>
        </div>
    );
};

export default SelectGameCardContainer;
