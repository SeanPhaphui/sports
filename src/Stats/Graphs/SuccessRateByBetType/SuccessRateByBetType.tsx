import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { UserBetsV2, Bet } from "../../../Utils/Utils";
import { calculateSuccessRateByBetType } from "../../../Utils/BetUtils";

interface SuccessRateByBetTypeProps {
    userBets: UserBetsV2[];
}

const SuccessRateByBetType: React.FC<SuccessRateByBetTypeProps> = ({ userBets }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const successRates = calculateSuccessRateByBetType(userBets);

        const data = Object.entries(successRates).map(([player, rates]) => ({
            player,
            spread: rates.spread,
            overUnder: rates.overUnder,
        }));

        const svgWidth = 350;
        const svgHeight = 175;
        const margin = { top: 20, right: 20, bottom: 20, left: 25 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const players = userBets.map((user) => user.displayName);
        const betTypes = ["spread", "overUnder"];

        const svg = d3.select(svgRef.current).attr("width", svgWidth).attr("height", svgHeight);

        const x0 = d3.scaleBand().domain(players).rangeRound([0, width]).paddingInner(0.1);
        const x1 = d3.scaleBand().domain(betTypes).rangeRound([0, x0.bandwidth()]).padding(0.05);
        const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

        const color = d3.scaleOrdinal().domain(betTypes).range(d3.schemeSet2);

        svg.selectAll("*").remove();

        const mainGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const barsGroup = mainGroup.append("g");

        // This logic will draw bars for each bet type (spread, overUnder) for each player.
        barsGroup
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", (d) => `translate(${x0(d.player)},0)`)
            .selectAll("rect")
            .data((d) =>
                betTypes.map((betType) => ({ key: betType, value: d[betType as keyof typeof d] }))
            )
            .join("rect")
            .attr("x", (d) => x1(d.key) || 0)
            .attr("y", (d) => y(Number(d.value)))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(Number(d.value)))
            .attr("fill", (d) => color(d.key) as string);

        mainGroup
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .attr("fill", "white");

        mainGroup
            .append("g")
            .call(d3.axisLeft(y).ticks(10))
            .selectAll("text")
            .attr("fill", "white");
    }, [userBets]);

    return (
        <div className="SuccessRateByBetType">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SuccessRateByBetType;
