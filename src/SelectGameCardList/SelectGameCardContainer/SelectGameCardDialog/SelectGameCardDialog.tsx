import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import "./SelectGameCardDialog.css";
import { GameSelectionObject } from "../../../Utils/Utils";

interface SelectGameCardDialogProps {
    game: GameSelectionObject;
    // addGame: (contract: ContractObject) => void;
}

const SelectGameCardDialog: React.FC<SelectGameCardDialogProps> = (props) => {
    const { game } = props;

    // const inputProps = {
    //     type: "number",
    //     pattern: "[0-9]*",
    // };

    // const [buyBackPrice, setBuyBackPrice] = useState<number>(0);
    // const [optionCount, setOptionCount] = useState<number>(
    //     contract.optionCount
    // );
    // const [disabled, setDisabled] = useState<boolean>(true);

    // const handleContractUpdate = () => {
    //     const updatedTotalSellPrice = (contract.totalSellPrice / contract.optionCount) * optionCount

    //     const totalBuyBackPrice = optionCount > 1 ? buyBackPrice * optionCount : buyBackPrice;
    //     const updatedContract: ContractObject = {
    //         ...contract, // Copy all properties from the original object
    //         // Update the desired properties
    //         totalSellPrice: updatedTotalSellPrice,
    //         optionCount: optionCount,
    //         totalBuyBackPrice: totalBuyBackPrice,
    //     };
    //     updateContract(updatedContract);
    // };

    // const handleContractDeletion = () => {
    //     const id = contract.id;
    //     deleteContract(id);
    // };

    // useEffect(() => {
    //     if (buyBackPrice) {
    //         setDisabled(false);
    //     } else {
    //         setDisabled(true);
    //     }
    // }, [buyBackPrice]);

    // useEffect(() => {
    //     if (optionCount !== contract.optionCount) {
    //       setDisabled(false); // Set disabled to false when optionCount changes
    //     }
    //   }, [optionCount, contract.optionCount]);

    return (
        <div className="SelectGameCardDialog">
            HELLO
        </div>
    );
};

export default SelectGameCardDialog;
