import {
    List
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    GameCalendarObject,
    GameSelectionObject,
    fetchGameCalendar,
    getGamesByWeek
} from "../Utils/Utils";
import "./Weeks.css";

export interface WeeksProps {
    handleWeekChange: (week: string) => void;
}

const Weeks: React.FC<WeeksProps> = (props) => {
    const {handleWeekChange} = props;

    const [gameCalendar, setGameCalendar] = useState<GameCalendarObject[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    
    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
    useEffect(() => {
        setLoading(true); // Set loading when fetch starts
        // Assuming fetchGameCalendar is the function to fetch the GameCalendarObjects
        fetchGameCalendar().then((data) => {
            setGameCalendar(data);

            // Setting the week after gameCalendar has been set
            // This is just an example. Modify the logic as per your requirements.
            if (data && data.length > 0) {
                setActiveItemIndex(parseInt(data[0].week)-1);
                handleWeekChange(data[0].week); // setting the first week for simplicity, modify as needed
            }

            setLoading(false); // Set loading to false once fetch is complete
        });
    }, []);




    return (
        <div className="Weeks">
                {loading ? (
                    <List className="horizontalList">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="load-item">
                                <div className="pulsating-placeholder-top"></div>
                                <div className="pulsating-placeholder-bottom"></div>
                            </div>
                        ))}
                    </List>
                ) : (
                    <List className="horizontalList">
                        {gameCalendar.map((gameCalObj, index) => (
                            <div
                                key={index}
                                className={`item ${index === activeItemIndex ? "active" : ""}`}
                                onClick={() => {
                                    setActiveItemIndex(index);
                                    handleWeekChange((index + 1).toString()); // set the week based on the clicked index
                                }}
                            >
                                <div>{gameCalObj.label}</div>
                                <div className="detail">{gameCalObj.detail}</div>
                            </div>
                        ))}
                    </List>
                )}
        </div>
    );
};

export default Weeks;
