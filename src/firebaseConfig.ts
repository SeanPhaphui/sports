import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { Bet } from "./Utils/Utils";

const firebaseConfig = {
    apiKey: "AIzaSyB4N2vUOlqu9LB5yn4hDkCJS3XNn-jUbtM",
    authDomain: "sports-41aa0.firebaseapp.com",
    projectId: "sports-41aa0",
    storageBucket: "sports-41aa0.appspot.com",
    messagingSenderId: "233351778885",
    appId: "1:233351778885:web:9032c544c9617f964cc92c",
    measurementId: "G-763CGN06KV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);

const db = getDatabase(app);

// Fetch user bets
export const fetchUserBets = async (uid: string, week: string) => {
    const betsRef = child(ref(db), `users/${uid}/bets/${week}`);
    const snapshot = await get(betsRef);
    if (snapshot.exists()) return snapshot.val();
    return [];
};

// Save user bets
export const saveUserBets = async (uid: string, week: string, bets: Bet[]) => {
    console.log("Firebase Config Save Bets: ", bets);

    const formattedBets = bets.map((bet) => ({
        ...bet,
        game: {
            ...bet.game,
            date: bet.game.date.toISOString(), // Convert to string before saving
        },
    }));

    const betsRef = ref(db, `users/${uid}/bets/${week}`);
    await set(betsRef, formattedBets);
};

export const fetchAllBetsForWeek = async (week: string): Promise<{ uid: string, bets: Bet[], displayName: string }[]> => {
    const allUsersBets: { uid: string, bets: Bet[], displayName: string }[] = [];
    const usersRef = ref(db, 'users');
    try{
        const usersSnapshot = await get(usersRef);
    
        if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
    
            for (let uid in usersData) {
                if (usersData[uid].bets && usersData[uid].bets[week]) {
                    const userBets: Bet[] = usersData[uid].bets[week].map((bet: any) => {
                        return {
                            ...bet,
                            game: {
                                ...bet.game,
                                date: new Date(bet.game.date)
                            }
                        };
                    });
    
                    console.log("usersdata: ", usersData[uid])
    
                    allUsersBets.push({
                        uid,
                        bets: userBets,
                        displayName: usersData[uid].displayName || usersData[uid].email || "N/A" // Default to "N/A" if no displayName found
                    });
                }
            }
        }

    }catch (error) {
        console.error("Error fetching data:", error);
    }

    return allUsersBets;
};

export { app, auth, db };
