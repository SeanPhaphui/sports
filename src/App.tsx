import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";
import "./font.css";
import Home from "./Home/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import Games from "./Games/Games";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import HistoryIcon from "@mui/icons-material/History";
import History from "./History/History";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [value, setValue] = useState("/"); // State for the selected navigation item

    useEffect(() => {
        const auth = getAuth();

        // This sets up an observer. When the user logs in or out, this callback gets executed.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup the observer when the component is unmounted.
        return () => {
            unsubscribe();
        };
    }, []);

    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        navigate(newValue); // Navigate to the selected route
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/games" element={<Games user={user} />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </header>
                <div className="bottom-nav">
                    <BottomNavigation
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            paddingBottom: "15px",
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        value={value}
                        onChange={handleChange}
                    >
                        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
                        <BottomNavigationAction
                            label="Games"
                            value="/games"
                            icon={<ScoreboardIcon />}
                        />
                        <BottomNavigationAction
                            label="History"
                            value="/history"
                            icon={<HistoryIcon />}
                        />
                    </BottomNavigation>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default App;
