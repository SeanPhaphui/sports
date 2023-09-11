import React from "react";
import "./SelectGameCardList.css";
import { Card, createTheme, styled } from "@mui/material";
import { Slide } from "@mui/material";
import { Bet, Game, convertToLocalTime } from "../Utils/Utils";
import SelectGameCardContainer from "./SelectGameCardContainer/SelectGameCardContainer";

interface SelectGameCardListProps {
    game: Game[];
    filterText: string;
    handleAddBet: (bet: Bet) => void;
}

const SelectGameCardList: React.FC<SelectGameCardListProps> = (props) => {
    const { game, filterText, handleAddBet } = props;

    const sortedGameSelections = [...game].sort((a, b) => {
        if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
        if (b.status === 'ongoing' && a.status !== 'ongoing') return 1;

        const dateA = a.date instanceof Date ? a.date.getTime() : 0;
        const dateB = b.date instanceof Date ? b.date.getTime() : 0;
        return dateA - dateB;
    });

    const groupedByDate = sortedGameSelections.reduce((acc: { [date: string]: Game[] }, currentGame) => {
        const localDate = currentGame.date; // Since it's already in local timezone
        const dateKey = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`; // Format YYYY-MM-DD
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(currentGame);
        return acc;
    }, {});
    

    const sortedDates = Object.entries(groupedByDate).sort(([dateA, gamesA], [dateB, gamesB]) => {
        const hasOngoingA = gamesA.some(game => game.status === 'ongoing');
        const hasOngoingB = gamesB.some(game => game.status === 'ongoing');
        
        if (hasOngoingA && !hasOngoingB) return -1;
        if (!hasOngoingA && hasOngoingB) return 1;

        return new Date(dateA) < new Date(dateB) ? -1 : 1;
    });

    const formatDate = (dateStr: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        };
    
        // Split the date string into its parts.
        const [year, month, day] = dateStr.split('-').map(Number);
    
        // Create a new Date object using the year, month, and day.
        // Note: The month is 0-indexed in JavaScript.
        const localDate = new Date(year, month - 1, day);
    
        return localDate.toLocaleDateString('en-US', options).toUpperCase();
    };
    

    return (
        <div className="SelectGameCardList">
            {sortedDates.map(([date, games]) => (
                <Card className="date-list" key={date}>
                    {/* Render the date header */}
                    <h4>{formatDate(date)}</h4>
                    {games
                        .filter(game => game.eventName.toLowerCase().includes(filterText.toLowerCase())) // Apply filter
                        .map(game => (
                            <SelectGameCardContainer key={game.gameId} game={game} handleAddBet={handleAddBet} />
                        ))}
                </Card>
            ))}
        </div>
    );
};

export default SelectGameCardList;
