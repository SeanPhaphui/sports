import React from "react";
import { Bet, Game } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";
import { Dialog, DialogTitle, Fade } from "@mui/material";
import SelectGameCardDialog from "./SelectGameCardDialog/SelectGameCardDialog";
import "./SelectGameCardContainer.css";

interface SelectGameCardContainerProps {
    game: Game;
    handleAddBet: (bet: Bet) => void;
    allBetsForWeek: { uid: string; bets: Bet[]; displayName: string }[];
    currentUserId: string;
}

const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = ({
    game,
    handleAddBet,
    allBetsForWeek,
    currentUserId,
}) => {
    const [open, setOpen] = React.useState(false);
    const [shouldShake, setShouldShake] = React.useState(false);

    const handleClickOpen = () => {
        // Count the total bets for this game
        const totalBetsForThisGame = allBetsForWeek
            .flatMap((userBets) => userBets.bets)
            .filter((bet) => bet.game.gameId === game.gameId).length;

        // Count the bets placed by the current user this week
        const userBetsThisWeek =
            allBetsForWeek.find((userBets) => userBets.uid === currentUserId)?.bets.length || 0;

        // Check both conditions
        if (totalBetsForThisGame >= 4 || userBetsThisWeek >= 5) {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 900); // Duration of shake animation
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAndAdd = (bet: Bet) => {
        handleAddBet(bet);
        setOpen(false);
    };

    return (
        <div className={shouldShake ? "subtle-shake" : ""}>
            <SelectGameCard
                game={game}
                openDialog={handleClickOpen}
                allBetsForWeek={allBetsForWeek}
            />
            <Dialog
                TransitionComponent={Fade}
                transitionDuration={250}
                onClose={handleClose}
                open={open}
            >
                <DialogTitle>Place Bet</DialogTitle>
                <SelectGameCardDialog
                    game={game}
                    handleAddBet={handleCloseAndAdd}
                    allBetsForWeek={allBetsForWeek}
                />
            </Dialog>
        </div>
    );
};

export default SelectGameCardContainer;
