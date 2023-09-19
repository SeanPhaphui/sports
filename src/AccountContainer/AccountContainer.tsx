import { Avatar, Dialog } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { User } from "firebase/auth";
import React from "react";
import Account from "./Account/Account";
import './AccountContainer.css';

interface AccountContainerProps {
    user: User | null;
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
            <Avatar onClick={handleClickOpen} sx={{ bgcolor: deepPurple[500], width: 24, height: 24 }}></Avatar>
            <Dialog onClose={handleClose} open={open}>
                <Account user={user} onSubmit={handleClose}/>
            </Dialog>
        </div>
    );
};

export default AccountContainer;
