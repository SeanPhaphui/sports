import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import {
    getDownloadURL,
    getMetadata,
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
} from "firebase/storage";
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

// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(app);

// Fetch user bets
export const fetchUserBets = async (uid: string, week: string) => {
    const betsRef = child(ref(db), `users/${uid}/bets/${week}`);
    const snapshot = await get(betsRef);
    if (snapshot.exists()) return snapshot.val();
    return [];
};

// Save user bets
export const saveUserBets = async (uid: string, week: string, bets: Bet[]) => {
    console.log("FIREBASE - Saving User Bets: ", bets);

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

export const fetchAllBetsForWeek = async (
    week: string
): Promise<{ uid: string; bets: Bet[]; displayName: string }[]> => {
    const allUsersBets: { uid: string; bets: Bet[]; displayName: string }[] = [];
    const usersRef = ref(db, "users");
    try {
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
                                date: new Date(bet.game.date),
                            },
                        };
                    });

                    allUsersBets.push({
                        uid,
                        bets: userBets,
                        displayName: usersData[uid].displayName || usersData[uid].email || "N/A", // Default to "N/A" if no displayName found
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return allUsersBets;
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

export { app, auth, db };
