import React from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import CumulativeWinsOverSeason from "../Graphs/CumulativeWinsOverSeason";
import "./GraphCard.css";


interface GraphCardProps {
    title: string
    userBets: UserBetsV2[];
}

const GraphCard: React.FC<GraphCardProps> = ({title, userBets }) => {


    return (
        <div className="GraphCard">
            <div className="header">{title}</div>
            <CumulativeWinsOverSeason userBets={userBets} />
        </div>
    );
};

export default GraphCard;
