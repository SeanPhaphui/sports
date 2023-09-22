import { Dialog, DialogTitle, Fade } from "@mui/material";
import React from "react";
import { AlertProps, Bet, Game } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";
import "./SelectGameCardContainer.css";
import SelectGameCardDialog from "./SelectGameCardDialog/SelectGameCardDialog";

interface SelectGameCardContainerProps {
    game: Game;
    handleAddBet: (bet: Bet) => void;
    allBetsForWeek: { uid: string; bets: Bet[]; displayName: string }[];
    currentUserId: string;
    betLock: boolean;
    alertProps: AlertProps;
}


const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = ({
    game,
    handleAddBet,
    allBetsForWeek,
    currentUserId,
    betLock,
    alertProps
}) => {
    const [open, setOpen] = React.useState(false);
    const [shouldShake, setShouldShake] = React.useState(false);

    const handleClickOpen = () => {
        if (betLock) {
            setShouldShake(true);
            alertProps.handleAlertOpen(true);
            alertProps.handleAlertMessage("Betting is locked due to lock-in period!");
            setTimeout(() => setShouldShake(false), 900); // Duration of shake animation
            return;
        }

        // Count the total bets for this game
        const totalBetsForThisGame = allBetsForWeek
            .flatMap((userBets) => userBets.bets)
            .filter((bet) => bet.game.gameId === game.gameId).length;

        // Count the bets placed by the current user this week
        const userBetsThisWeek =
            allBetsForWeek.find((userBets) => userBets.uid === currentUserId)?.bets.length || 0;

        if (totalBetsForThisGame >= 4) {
            setShouldShake(true);
            alertProps.handleAlertOpen(true);
            alertProps.handleAlertMessage("All possible bets have been made on this game!");
            setTimeout(() => setShouldShake(false), 900);
        } else if (userBetsThisWeek >= 5) {
            setShouldShake(true);
            alertProps.handleAlertOpen(true);
            alertProps.handleAlertMessage("You have reached the 5-bet limit for the week!");
            setTimeout(() => setShouldShake(false), 900);
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
