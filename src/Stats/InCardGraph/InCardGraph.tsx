import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./InCardGraph.css";
import { UserBetsV2, Bet } from "../../Utils/Utils";
import { calculateUserWins } from "../../Utils/BetUtils";

interface InCardGraphProps {
    userBets: UserBetsV2[];
}

const InCardGraph: React.FC<InCardGraphProps> = ({ userBets }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        // Transform userBets data into a format suitable for D3
        const weeks = new Set<string>();
        userBets.forEach((user) => {
            for (let year in user.bets) {
                for (let week in user.bets[year]) {
                    // Check if all games for this week have a status of "Final"
                    const allGamesFinal = user.bets[year][week].every(
                        (bet) => bet.game.status === "final"
                    );
                    if (allGamesFinal) {
                        weeks.add(week);
                    }
                }
            }
        });

        // Convert the Set to an array
        const weeksArray = Array.from(weeks);

        // Sort the array
        weeksArray.sort((a, b) => {
            // Extract the numbers from the string and compare them
            const numA = parseInt(a.replace("week", ""));
            const numB = parseInt(b.replace("week", ""));
            return numA - numB;
        });

        // If you want to convert it back to a Set (though for your purpose, an array should suffice)
        const sortedWeeksSet = new Set(weeksArray);
        console.log(sortedWeeksSet);

        const data: any[] = [];
        sortedWeeksSet.forEach((week) => {
            const weekData: any = { week };
            userBets.forEach((user) => {
                let totalWins = 0;
                for (let year in user.bets) {
                    if (user.bets[year][week]) {
                        totalWins += calculateUserWins(
                            user.bets[year][week].filter((bet) => bet.game.status === "final")
                        );
                    }
                }
                weekData[user.displayName] = totalWins;
            });
            console.log(weekData);
            data.push(weekData);
        });

        // Determine dynamic width
        const baseWidth = 350; // Base width for 5 weeks
        const widthIncrement = 50; // Width added for each week beyond 5
        const dynamicWidth = baseWidth + Math.max(0, sortedWeeksSet.size - 5) * widthIncrement;

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
        const x0 = d3.scaleBand().domain(sortedWeeksSet).rangeRound([0, width]).paddingInner(0.1);
        const x1 = d3.scaleBand().domain(keys).rangeRound([0, x0.bandwidth()]).padding(0.05);
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

        // Append rectangles to a specific group
        const barsGroup = mainGroup.append("g");

        barsGroup
            .selectAll("g.bar")
            .data(data)
            .join("g")
            .attr("class", "bar") // Add a class to the group for specificity
            .attr("transform", (d) => `translate(${x0(d.week)},0)`)
            .selectAll("rect")
            .data((d) => keys.map((key) => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", (d) => x1(d.key) || 0)
            .attr("y", (d) => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(d.value))
            .attr("fill", (d) => color(d.key) as string);

        // X Axis
        mainGroup.append("g")
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
        <div className="InCardGraph">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default InCardGraph;
