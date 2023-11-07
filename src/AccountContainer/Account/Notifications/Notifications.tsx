import { User } from "firebase/auth";
import * as React from "react";

interface NotificationsProps {
    user: User;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {


    return (
        <div className="Notifications">

        </div>
    );
};

export default Notifications;
