import { ref, set } from "@firebase/database";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { User, updateProfile, signOut } from "firebase/auth";
import * as React from "react";
import { auth, db } from "../../firebaseConfig";
import { getLetter } from "../../Utils/Utils";
// import Notifications from "./Notifications/Notifications";

interface AccountProps {
    user: User;
    onSubmit: () => void;
    onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ user, onLogout }) => {
    const [newDisplayName, setNewDisplayName] = React.useState("");
    const [feedbackMessage, setFeedbackMessage] = React.useState("");
    const [isSuccess, setIsSuccess] = React.useState<boolean | null>(null);
    const [currentDisplayName, setCurrentDisplayName] = React.useState<string | null>(null);
    const [disableChangeDisplayName, setDisableChangeDisplayName] = React.useState<boolean>(true);

    React.useEffect(() => {
        setCurrentDisplayName(user.displayName || user.email);
    }, []);

    const handleChangeDisplayName = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Update displayName in Firebase Authentication
            await updateProfile(user, {
                displayName: newDisplayName,
            });

            // Update displayName in Firebase Realtime Database
            const userRef = ref(db, `users/${user.uid}/displayName`);
            await set(userRef, newDisplayName);

            setCurrentDisplayName(newDisplayName);
            setIsSuccess(true);
            setFeedbackMessage("Display name updated successfully.");
        } catch (error) {
            setIsSuccess(false);
            if (error instanceof Error) {
                setFeedbackMessage(error.message);
            } else {
                setFeedbackMessage("An unknown error occurred.");
            }
        }
    };

    React.useEffect(() => {
        if (newDisplayName) {
            setDisableChangeDisplayName(false);
        } else {
            setDisableChangeDisplayName(true);
        }
    }, [newDisplayName]);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Assuming `auth` is your Firebase auth instance, which needs to be imported
            onLogout(); // This is a prop function that you should define to handle post-logout behavior
        } catch (error) {
            // Handle errors here, such as showing an error message to the user
            setIsSuccess(false);
            if (error instanceof Error) {
                setFeedbackMessage(error.message);
            } else {
                setFeedbackMessage("Failed to logout.");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    my: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "#101113" }}>{getLetter(user)}</Avatar>
                <Typography component="h1" variant="h5" align="center">
                    Current Display Name
                </Typography>
                <Typography component="h1" variant="h6" align="center" sx={{ mb: 1 }}>
                    {currentDisplayName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    This display name is how others will see you. If not set, your email will be
                    used.
                </Typography>
                <Box component="form" onSubmit={handleChangeDisplayName} noValidate>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="displayName"
                        label="New Display Name"
                        name="displayName"
                        autoComplete="name"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                    />
                    <Button
                        type="submit"
                        disabled={disableChangeDisplayName}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                    >
                        Change Display Name
                    </Button>
                </Box>
                <Button
                    onClick={handleLogout} // Added onClick event here
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 1, backgroundColor: "red" }}
                >
                    Logout
                </Button>
                {/* <Notifications user={user} /> */}
                {feedbackMessage !== "" && (
                    <Typography
                        component="body"
                        variant="body2"
                        sx={{ mt: 1, mb: 1, color: isSuccess ? "green" : "red" }}
                    >
                        {feedbackMessage}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default Account;
