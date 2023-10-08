import {
    List
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
    GameCalendarObject,
    fetchGameCalendar
} from "../Utils/Utils";
import "./Weeks.css";

export interface WeeksProps {
    handleSeasonWeekChange: (seasonYear: string, week: string) => void;
}

const Weeks: React.FC<WeeksProps> = (props) => {
    const {handleSeasonWeekChange} = props;

    const [gameCalendar, setGameCalendar] = useState<GameCalendarObject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

    const weekContainerRef = useRef<HTMLDivElement>(null); // Step 1: Add a ref

    useEffect(() => {
        setLoading(true);
        fetchGameCalendar().then((data) => {
            setGameCalendar(data);
            if (data && data.length > 0) {
                setActiveItemIndex(parseInt(data[0].week)-1);
                handleSeasonWeekChange(data[0].seasonYear, data[0].week);
            }
            setLoading(false);
        });
    }, []);

    // Step 3: Scroll the active item into view when it changes
    useEffect(() => {
        if (weekContainerRef.current) {
            const activeItem = weekContainerRef.current.querySelector('.item.active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeItemIndex]);

    return (
        <div className="Weeks" ref={weekContainerRef}> {/* Step 2: Use the ref on the wrapping div */}
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
                                    handleSeasonWeekChange(gameCalObj.seasonYear, (index + 1).toString());
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
