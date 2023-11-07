import { Avatar, Dialog } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";
import { getLetter } from "../Utils/Utils";
import Account from "./Account/Account";
import './AccountContainer.css';

interface AccountContainerProps {
    user: User;
}

const AccountContainer: React.FC<AccountContainerProps> = ({user}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="AccountContainer">
            <Avatar onClick={handleClickOpen} sx={{ bgcolor: "#101113"}}>{getLetter(user)}</Avatar>
            <Dialog onClose={handleClose} open={open}>
                <Account user={user} onSubmit={handleClose} onLogout={handleClose}/>
            </Dialog>
        </div>
    );
};

export default AccountContainer;
