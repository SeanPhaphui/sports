import React from "react";
import { GameSelectionObject } from "../../Utils/Utils";
import SelectGameCard from "./SelectGameCard/SelectGameCard";

interface SelectGameCardContainerProps {
    game: GameSelectionObject;
}

const SelectGameCardContainer: React.FC<SelectGameCardContainerProps> = (props) => {
    const { game} = props;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleContractUpdate = (contract: ContractObject) => {
    //     updateContract(contract);
    //     setOpen(false);
    //   };


    return (
        <div>
            <SelectGameCard game={game} openDialog={handleClickOpen}/>
            {/* <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{contract.ticker + " " + contract.strikePrice + " " + contract.optionType}</DialogTitle>
                <ContractUpdater contract={contract} updateContract={handleContractUpdate} deleteContract={deleteContract}/>
            </Dialog> */}
        </div>
    );
};

export default SelectGameCardContainer;
