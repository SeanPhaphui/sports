import { ref, set } from "@firebase/database";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { User, updateProfile } from "firebase/auth";
import * as React from "react";
import { db } from "../../firebaseConfig";

interface AccountProps {
    user: User | null;
    onSubmit: () => void;
}

const Account: React.FC<AccountProps> = ({ user }) => {
    const [newDisplayName, setNewDisplayName] = React.useState("");
    const [feedbackMessage, setFeedbackMessage] = React.useState("");
    const [isSuccess, setIsSuccess] = React.useState<boolean | null>(null);
    const [currentDisplayName, setCurrentDisplayName] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (user) {
            setCurrentDisplayName(user.displayName || user.email);
        }
    }, []);

    const handleChangeDisplayName = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (user) {
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
        } else {
            setIsSuccess(false);
            setFeedbackMessage("User not authenticated.");
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
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <AccountCircleOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Current Display Name: {currentDisplayName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    This display name is how others will see you. If not set, your email will be used.
                </Typography>
                <Box component="form" onSubmit={handleChangeDisplayName} noValidate sx={{ mt: 1 }}>
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
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Change Display Name
                    </Button>
                </Box>
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
