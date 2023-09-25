import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AccountContainer from "../AccountContainer/AccountContainer";
import SignInContainer from "../SignInContainer/SignInContainer";
import SignUpContainer from "../SignUpContainer/SignUpContainer";
import "./HomeHeader.css";
import { AppBar, Toolbar } from "@mui/material";

interface HomeHeaderProps {
    user: User | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        if (user) {
            setEmail(user.email || null);
        } else {
            setEmail(null);
        }
        setLoading(false); // Set loading to false once we've checked the user
    }, [user]);

    if (loading) {
        return <div>Loading...</div>; // Or replace with a spinner or some other placeholder
    }

    return (
        <div className="HomeHeader">
            <AppBar className="top-bar" position="sticky" color="transparent">
                <Toolbar className="top">
                    <div>College Football Analysts</div>
                    {user ? (
                        <AccountContainer user={user} />
                    ) : (
                        <div className="buttons">
                            <SignInContainer />
                            <div className="divider"></div>
                            <SignUpContainer />
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default HomeHeader;
