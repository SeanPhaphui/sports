import React, { useMemo } from "react";
import { UserBetsV2 } from "../../Utils/Utils";
import CumulativeBetWinsOverSeason from "../Graphs/CumulativeBetWinsOverSeason/CumulativeBetWinsOverSeason";
import "./GraphCard.css";
import { getSortedFinalWeeks } from "../../Utils/GraphUtils.";


interface GraphCardProps {
    title: string
    userBets: UserBetsV2[];

}

const GraphCard: React.FC<GraphCardProps> = ({title, userBets }) => {

    const weeksArray = useMemo(() => getSortedFinalWeeks(userBets), [userBets]);

    return (
        <div className="GraphCard">
            <div className="header">{title}</div>
            <CumulativeBetWinsOverSeason userBets={userBets} weeksArray={weeksArray} />
        </div>
    );
};

export default GraphCard;
