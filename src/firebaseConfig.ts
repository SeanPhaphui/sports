import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { deleteToken, getMessaging } from "firebase/messaging";
import { Bet, CurrentWeekAndSeason, UserBets } from "./Utils/Utils";

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

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(app);

// Fetch user bets
export const fetchUserBets = async (uid: string, week: string, year: string) => {
    const betsRef = child(ref(db), `usersBets/${uid}/bets/${year}/${week}`);
    const snapshot = await get(betsRef);
    if (snapshot.exists()) return snapshot.val();
    return [];
};

// Save user bets
export const saveUserBets = async (uid: string, week: string, year: string, bets: Bet[]) => {
    console.log("FIREBASE - Saving User Bets: ", bets);

    const formattedBets = bets.map((bet) => ({
        ...bet,
        game: {
            ...bet.game,
            date: bet.game.date.toISOString(), // Convert to string before saving
        },
    }));

    const betsRef = ref(db, `usersBets/${uid}/bets/${year}/${week}`);
    await set(betsRef, formattedBets);
};

// Save outcomes of games for a week
export const saveOutcomes = async (currentWeekAndSeason: CurrentWeekAndSeason, outcomes: Bet[]) => {
    console.log("FIREBASE - Saving Outcomes: ", outcomes);
    const currentWeek = currentWeekAndSeason.seasonType === 3 ? "16" : currentWeekAndSeason.week;
    const formattedOutcomes = outcomes.map((outcome) => ({
        ...outcome,
        game: {
            ...outcome.game,
            date: outcome.game.date.toISOString(), // Convert to string before saving
        },
    }));

    const outcomesRef = ref(
        db,
        `outcomes/${currentWeekAndSeason.seasonYear}/week${currentWeek}`
    );
    await set(outcomesRef, formattedOutcomes);
};

export const fetchAllBetsForWeek = async (
    week: string,
    year: string,
    updateStatus?: (status: string) => void
): Promise<{ uid: string; bets: Bet[]; displayName: string }[]> => {
    const allUsersBets: { uid: string; bets: Bet[]; displayName: string }[] = [];

    try {
        if (updateStatus) updateStatus("Fetching user list...");
        // Reference to the list of users
        const usersRef = ref(db, "users");
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const uids = Object.keys(usersData);

            for (let uid of uids) {
                // Path to the specific week's bets for the current user
                const userBetsRef = ref(db, `usersBets/${uid}/bets/${year}/${week}`);
                if (updateStatus) updateStatus(`Fetching bets for user: ${uid}...`);

                const userBetsSnapshot = await get(userBetsRef);

                if (userBetsSnapshot.exists()) {
                    const userBets = userBetsSnapshot.val().map((bet: any) => ({
                        ...bet,
                        game: {
                            ...bet.game,
                            date: new Date(bet.game.date),
                        },
                    }));

                    allUsersBets.push({
                        uid,
                        bets: userBets,
                        displayName: usersData[uid].displayName || usersData[uid].email || "N/A",
                    });
                }
            }
        }

        if (updateStatus) updateStatus("All bets fetched successfully.");
    } catch (error) {
        console.error("Error fetching data:", error);
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            if (updateStatus) updateStatus(`Error fetching bets: ${error.message}`);
        } else {
            if (updateStatus) updateStatus("Error fetching bets: An unknown error occurred");
        }
    }

    return allUsersBets;
};

export const fetchAvailableYearsAndWeeks = async (): Promise<{ [year: string]: string[] }> => {
    try {
        const outcomesRef = ref(db, "outcomes");
        const snapshot = await get(outcomesRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            let yearsAndWeeks: { [year: string]: string[] } = {};

            for (let year in data) {
                yearsAndWeeks[year] = Object.keys(data[year]);
            }

            return yearsAndWeeks;
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error fetching available years and weeks:", error);
        throw error;
    }
};

export const fetchOutcomes = async ({
    year,
    week,
}: {
    year: string;
    week: string;
}): Promise<UserBets[]> => {
    try {
        const outcomesRef = ref(db, `outcomes/${year}/${week}`);
        const outcomesSnapshot = await get(outcomesRef);

        if (!outcomesSnapshot.exists()) {
            return [];
        }

        const rawOutcomesData: Bet[] = outcomesSnapshot.val();
        const outcomesData: Bet[] = rawOutcomesData.map((outcome: any) => {
            return {
                ...outcome,
                game: {
                    ...outcome.game,
                    date: new Date(outcome.game.date),
                },
            };
        });

        const usersRef = ref(db, "users");
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val();

        const userBetsArray: UserBets[] = [];

        for (let uid in usersData) {
            const userBetRef = ref(db, `usersBets/${uid}/bets/${year}/${week}`);
            const userBetSnapshot = await get(userBetRef);

            if (userBetSnapshot.exists()) {
                const userBets: Bet[] = userBetSnapshot.val().map((bet: any) => {
                    const outcome = outcomesData.find((outcome) => outcome.id === bet.id);

                    if (outcome) {
                        return outcome;
                    } else {
                        if (bet.game && typeof bet.game.date === "string") {
                            return {
                                ...bet,
                                game: {
                                    ...bet.game,
                                    date: new Date(bet.game.date),
                                },
                            };
                        }
                        return bet;
                    }
                });

                userBetsArray.push({
                    uid: uid,
                    displayName: usersData[uid]?.displayName || "Unknown",
                    bets: userBets,
                });
            }
        }

        return userBetsArray;
    } catch (error) {
        console.error("Error fetching outcomes:", error);
        throw error;
    }
};

interface Week {
    [key: string]: Bet[];
}

export const fetchAvailableSeasons = async (): Promise<string[]> => {
    try {
        // Reference to the 'outcomes' node in the database
        const outcomesRef = ref(db, "outcomes");
        const snapshot = await get(outcomesRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const seasons = Object.keys(data); // Extract the years (seasons) from the 'outcomes' node
            return seasons.sort((a, b) => b.localeCompare(a)); // Sort seasons in descending order, e.g., "2023" before "2022"
        } else {
            console.warn("No seasons data found in the database.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching available seasons:", error);
        throw error;
    }
};

interface RawOutcomesData {
    [year: string]: Week;
}

export const fetchAllOutcomes = async (year: string): Promise<RawOutcomesData> => {
    try {
        // Fetch outcomes for the specific year
        const outcomesRef = ref(db, `outcomes/${year}`);
        const outcomesSnapshot = await get(outcomesRef);

        if (!outcomesSnapshot.exists()) {
            throw new Error(`Outcomes data for the year ${year} does not exist`);
        }

        // We wrap the results in an object with the year as the key
        const rawOutcomesData: RawOutcomesData = { [year]: outcomesSnapshot.val() };
        return rawOutcomesData;
    } catch (error) {
        console.error(`Error fetching outcomes for the year ${year}:`, error);
        throw error;
    }
};


interface YearlyBets {
    [week: string]: Bet[];
}

interface BetData {
    [year: string]: YearlyBets;
}

interface RawUserData {
    displayName: string;
    email: string;
    bets?: BetData; // The bets attribute is optional because not all users may have placed bets
}

interface Users {
    [userId: string]: RawUserData;
}

export const fetchAllUsers = async (): Promise<Users> => {
    try {
        // Fetch all user data
        const usersRef = ref(db, "users");
        const usersSnapshot = await get(usersRef);

        if (!usersSnapshot.exists()) {
            throw new Error("User data does not exist");
        }

        const rawUserData: Users = usersSnapshot.val();
        return rawUserData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

interface RawUserBets {
    bets?: BetData; // The bets attribute is optional because not all users may have placed bets
}

interface UsersBets {
    [userId: string]: RawUserBets;
}

export const fetchAllUsersBets = async (): Promise<UsersBets> => {
    try {
        // Fetch all user data
        const usersRef = ref(db, "usersBets");
        const usersSnapshot = await get(usersRef);

        if (!usersSnapshot.exists()) {
            throw new Error("User bet data does not exist");
        }

        const rawUserData: Users = usersSnapshot.val();
        return rawUserData;
    } catch (error) {
        console.error("Error fetching user bet data:", error);
        throw error;
    }
};

// Function to save the FCM token to the Realtime Database
export const saveFcmTokenToDatabase = async (uid: string, token: string) => {
    // Here, 'db' refers to the Firebase Realtime Database instance that you have already initialized.
    const tokenRef = ref(db, `users/${uid}/fcmtoken`);
    try {
        await set(tokenRef, token);
        console.log("FCM token saved to database successfully.");
    } catch (error) {
        console.error("Error saving FCM token to database:", error);
        // Handle the error appropriately
        throw error;
    }
};

// This function is to unregister the service worker and delete the token
export const unregisterServiceWorker = async () => {
    await deleteToken(messaging);
    console.log("Token deleted.");
};

// export const fetchAvatarURL = async (uid: string): Promise<string | null> => {
//     try {
//         const avatarRef = storageRef(storage, `avatars/${uid}`);
//         const metadata = await getMetadata(avatarRef);
//         console.log(metadata.cacheControl);
//         const url = await getDownloadURL(avatarRef);
//         return url;
//     } catch (error) {
//         console.error("Error fetching avatar URL: ", error);
//         return null;
//     }
// };

// export const uploadAvatar = async (uid: string, file: File): Promise<string | null> => {
//     const avatarReference = storageRef(storage, `avatars/${uid}`);

//     // Metadata to set cache control for 1 day
//     const metadata = {
//         cacheControl: "public, max-age=86400", // 1 day
//     };

//     try {
//         // Upload the file
//         const snapshot = await uploadBytesResumable(avatarReference, file, metadata);

//         // Get the download URL after successful upload
//         const url = await getDownloadURL(snapshot.ref);
//         return url;
//     } catch (error) {
//         console.error("Error uploading avatar: ", error);
//         return null;
//     }
// };

export { app, auth, db, messaging };
