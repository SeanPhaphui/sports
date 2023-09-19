import { createUserWithEmailAndPassword, updateProfile, User, UserCredential } from "firebase/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { auth, db } from "../firebaseConfig";
import { ref, set } from "@firebase/database";

interface SignUpProps {
    onSubmit: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSubmit }) => {
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
    
            // Update the user's profile to set displayName
            await updateProfile(user, {
                displayName: displayName // Assuming displayName is a state variable or something similar
            });
    
            // Save displayName and email in the Firebase Realtime Database
            const userRef = ref(db, `users/${user.uid}`);
            await set(userRef, {
                displayName: displayName,
                email: email
            });
    
            console.log(user);
            onSubmit();
        } catch (error) {
            if (error instanceof Error) {
                const errorMessage = error.message;
                switch (errorMessage) {
                    case "Firebase: Error (auth/email-already-in-use).":
                        setError("Email is already in use.");
                        break;
                    case "Firebase: Error (auth/invalid-email).":
                        setError("Invalid email address.");
                        break;
                    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
                        setError("Password should be at least 6 characters.");
                        break;
                    default:
                        setError(errorMessage);
                        break;
                }
            } else {
                setError("An unknown error occurred.");
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
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleCreateAccount} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="displayName"
                                fullWidth
                                id="displayName"
                                label="Display Name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                </Box>
                {error != "" && (
                    <Typography
                        component="body"
                        variant="body2"
                        sx={{ mt: 1, mb: 1, color: "red" }}
                    >
                        {error}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default SignUp;
