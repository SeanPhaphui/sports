import React from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import './SignUpContainer.css';
import SignUp from "../SignUp/SignUp";
import { User } from "firebase/auth";

interface SignUpContainerProps {

}

const SignUpContainer: React.FC<SignUpContainerProps> = ({}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="SignUpContainer">
            <Button
            onClick={handleClickOpen}
            >
                Sign Up
            </Button>
            <Dialog onClose={handleClose} open={open}>
                <SignUp onSubmit={handleClose}/>
            </Dialog>
        </div>
    );
};

export default SignUpContainer;
