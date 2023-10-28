import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./CumulativeBetWinsOverSeason.css";
import { UserBetsV2, Bet } from "../../../Utils/Utils";
import { calculateUserWins } from "../../../Utils/BetUtils";

interface CumulativeBetWinsOverSeasonProps {
    userBets: UserBetsV2[];
    weeksArray: string[];
}

const CumulativeBetWinsOverSeason: React.FC<CumulativeBetWinsOverSeasonProps> = ({ userBets, weeksArray }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        // Calculate cumulative wins for each user
        const cumulativeWins: { [displayName: string]: number[] } = {};

        userBets.forEach((user) => {
            let totalWinsSoFar = 0;
            cumulativeWins[user.displayName] = [];
            weeksArray.forEach((week) => {
                let totalWins = 0;
                for (let year in user.bets) {
                    if (user.bets[year][week]) {
                        totalWins += calculateUserWins(
                            user.bets[year][week].filter((bet) => bet.game.status === "final")
                        );
                    }
                }
                totalWinsSoFar += totalWins;
                cumulativeWins[user.displayName].push(totalWinsSoFar);
            });
        });

        // Determine dynamic width
        const baseWidth = 350; // Base width for 5 weeks
        const widthIncrement = 50; // Width added for each week beyond 5
        const dynamicWidth = baseWidth + Math.max(0, weeksArray.length - 5) * widthIncrement;

        // Update SVG and D3 Dimensions
        const svgWidth = dynamicWidth;
        const svgHeight = 125;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 }; // adjusted margins
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const keys = userBets.map((user) => user.displayName);

        // Set up the SVG dimensions and create a group to contain all elements
        const svg = d3.select(svgRef.current).attr("width", svgWidth).attr("height", svgHeight);

        // Create scales
        const x0 = d3.scaleBand().domain(weeksArray).rangeRound([0, width]).paddingInner(0.1);
        const y = d3
            .scaleLinear()
            .domain([0, 5]) // Since there are 5 total bets
            .range([height, 0]);

        const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

        // Clear previous SVG content
        svg.selectAll("*").remove();

        const mainGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Adjust the y scale's domain based on the maximum cumulative wins
        const maxCumulativeWins = Math.max(
            ...Object.values(cumulativeWins).flatMap((wins) => wins)
        );
        y.domain([0, maxCumulativeWins]);

        const line = d3
            .line<number>()
            .x((d, i) => x0(weeksArray[i])! + x0.bandwidth() / 2)
            .y((d) => y(d));

        Object.entries(cumulativeWins).forEach(([displayName, wins]) => {
            mainGroup
                .append("path")
                .datum(wins)
                .attr("fill", "none")
                .attr("stroke", color(displayName) as string)
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

        // X Axis
        mainGroup
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .attr("fill", "white")
            .text((d, i, nodes) => {
                let weekStr = d as string; // Cast the unknown type to string
                return `Week ${weekStr.replace("week", "")}`;
            });

        // Y Axis
        mainGroup.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").attr("fill", "white");
    }, [userBets]);

    return (
        <div className="CumulativeBetWinsOverSeason">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default CumulativeBetWinsOverSeason;
