import React from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import CumulativeBetWinsOverSeason from "../Graphs/CumulativeBetWinsOverSeason/CumulativeBetWinsOverSeason";
import "./GraphCard.css";


interface GraphCardProps {
    title: string
    userBets: UserBetsV2[];
}

const GraphCard: React.FC<GraphCardProps> = ({title, userBets }) => {


    return (
        <div className="GraphCard">
            <div className="header">{title}</div>
            <CumulativeBetWinsOverSeason userBets={userBets} />
        </div>
    );
};

export default GraphCard;
