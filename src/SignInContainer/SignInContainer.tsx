import React from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import SignIn from "./SignIn/SignIn";
import './SignInContainer.css';

interface SignInContainerProps {}

const SignInContainer: React.FC<SignInContainerProps> = ({}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="SignInContainer">
            <Button
            onClick={handleClickOpen}
            >
                Log In
            </Button>
            <Dialog onClose={handleClose} open={open}>
                <SignIn onSubmit={handleClose}/>
            </Dialog>
        </div>
    );
};

export default SignInContainer;
