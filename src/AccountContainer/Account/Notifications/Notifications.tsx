import { User } from "firebase/auth";
import { deleteToken, getToken, onMessage } from "firebase/messaging";
import * as React from "react";
import { messaging, saveFcmTokenToDatabase } from "../../../firebaseConfig";
import { Typography } from "@mui/material";

interface NotificationsProps {
    user: User;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
    const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
    const [status, setStatus] = React.useState("");

    const askForPermissionToReceiveNotifications = async (uid: string) => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            setStatus("Notification permission granted.");

            // Make sure the service worker is ready
            const registration = await navigator.serviceWorker.ready;

            // Now that we have the service worker registration, let's try to get the token
            try {
                const token = await getToken(messaging, {
                    serviceWorkerRegistration: registration,
                    vapidKey:
                        "BPwbxEBshcIV-ZUWp_KpsilGmB9jALXLE5QfnIpKl-fN-s3FtYSWfiXe7-NqETzPMasiEdAgPKrrmPSwyKWFI4w",
                });
                console.log("Received FCM token:", token);

                // Save the token to the database using the user's UID
                await saveFcmTokenToDatabase(uid, token);
            } catch (err) {
                console.error("Error getting token:", err);
                if (err instanceof Error) {
                    // Set the status to the error's message
                    setStatus(`Error getting token: ${err.message}`);
                }

                // Handle the error appropriately here
            }
        } else {
            console.log("Unable to get permission to notify.");
            setStatus("Unable to get permission to notify.");

            throw new Error("Unable to get permission to notify.");
        }
    };

    const enableNotifications = async () => {
        try {
            await askForPermissionToReceiveNotifications(user.uid); // Await the token
            setIsNotificationEnabled(true);
        } catch (error) {
            console.error("Unable to get permission to notify.", error);
            setStatus("Unable to get permission to notify.");
        }
    };

    const disableNotifications = async () => {
        const permission = Notification.permission;
        if (permission === "granted") {
            try {
                // Attempt to delete the token
                const tokenDeleted = await deleteToken(messaging);
                if (tokenDeleted) {
                    console.log("Token deleted successfully. Notifications are now disabled.");
                    setStatus("Notifications are now disabled.");
                    setIsNotificationEnabled(false);
                } else {
                    console.log("No token exists to delete.");
                    setStatus("No token exists to delete. Notifications are already disabled.");
                }
            } catch (error) {
                console.error("An error occurred while deleting the token. ", error);
                setStatus("An error occurred while deleting the token.");
            }
        } else {
            setStatus("Notifications are not enabled, no need to disable.");
            console.log("Notifications are not enabled, no need to disable.");
        }
    };

    React.useEffect(() => {
        const checkNotificationStatus = async () => {
            // Check the current permission status
            const permission = Notification.permission;
            if (permission === "granted") {
                try {
                    // Ensure the service worker is ready
                    const registration = await navigator.serviceWorker.ready;

                    // Check if the token is available in the IndexedDB, but don't request a new one
                    const token = await getToken(messaging, {
                        serviceWorkerRegistration: registration,
                    });
                    if (token) {
                        // Token exists, so notifications are enabled
                        setIsNotificationEnabled(true);
                        setStatus("Notifications are enabled.");
                    } else {
                        // Token does not exist
                        setIsNotificationEnabled(false);
                        setStatus("Notifications have been granted but no token is available.");
                    }
                } catch (error) {
                    console.error("Error checking notification status:", error);
                }
            } else {
                // Notifications are not enabled or permission is not granted
                setIsNotificationEnabled(false);
                setStatus(`Notifications permission status: ${permission}`);
            }
        };

        checkNotificationStatus();
    }, [messaging]); // Added dependency on 'messaging' to re-run if that object changes

    return (
        <div className="Notifications">
            <button onClick={isNotificationEnabled ? disableNotifications : enableNotifications}>
                {isNotificationEnabled ? "Disable Notifications" : "Enable Notifications"}
            </button>
            <Typography
                component="body"
                variant="body2"
                sx={{ mt: 1, mb: 1, color: "black" }}
            >
                {status}
            </Typography>
        </div>
    );
};

export default Notifications;
