import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./AddBet.css";

interface AddBetProps {
    disabled: boolean;
    onAddBetChange: () => void;
}

const AddBet: React.FC<AddBetProps> = (props) => {
    const { disabled, onAddBetChange } = props;

    const wasClicked = useRef(false);

    const handleClick = () => {
        if (wasClicked.current) return; // prevent subsequent clicks
        wasClicked.current = true;
        onAddBetChange();
    };

    return (
        <div className="AddBet">
            <Button
                className="add"
                variant="contained"
                disabled={disabled}
                onClick={handleClick}
            >
                Add Bet
            </Button>
        </div>
    );
};

export default AddBet;
