import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Games from "./Games/Games";
import History from "./History/History";
import Home from "./Home/Home";
import Navigation from "./Navigation/Navigation";
import Stats from "./Stats/Stats";
import "./font.css";

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

    const onValueChange = (newValue: string) => {
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
                        <Route path="/stats" element={<Stats user={user} />} />
                    </Routes>
                </header>
                <Navigation value={value} onValueChange={onValueChange} />
            </div>
        </LocalizationProvider>
    );
}

export default App;
