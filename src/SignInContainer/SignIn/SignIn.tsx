import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import * as React from "react";
import { auth } from "../../firebaseConfig";

interface SignInProps {
    onSubmit: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSubmit }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Access user information from userCredential.user
            const user = userCredential.user;
            // Redirect or perform some other action on successful login
            onSubmit();
        } catch (error) {
            if (error instanceof Error) {
                const errorMessage = error.message;
                switch (errorMessage) {
                    case "Firebase: Error (auth/invalid-login-credentials).":
                        setError("Invalid login credentials.");
                        break;
                    case "Firebase: Error (auth/user-not-found).":
                        setError("There's no user corresponding to this email.");
                        break;
                    case "Firebase: Error (auth/invalid-email).":
                        setError("Invalid email address.");
                        break;
                    case "Firebase: Error (auth/wrong-password).":
                        setError("Wrong password.");
                        break;
                    case "Firebase: Error (auth/user-disabled).":
                        setError("The user account has been disabled.");
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

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setError("Password reset link has been sent to your email.");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
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
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Link href="#" variant="body2" onClick={handlePasswordReset}>
                        Forgot password?
                    </Link>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Log In
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

export default SignIn;
