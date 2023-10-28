import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./WeeklyWinComparison.css";
import { UserBetsV2, Bet } from "../../../Utils/Utils";
import { calculateUserWins } from "../../../Utils/BetUtils";

interface WeeklyWinComparisonProps {
    userBets: UserBetsV2[];
    weeksArray: string[];
}

const WeeklyWinComparison: React.FC<WeeklyWinComparisonProps> = ({ userBets, weeksArray }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const data: any[] = [];
        weeksArray.forEach((week) => {
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

        const duration = 750;

        // Append rectangles to a specific group
        const barsGroup = mainGroup.append("g");

        barsGroup
        .selectAll("g.bar")
        .data(data)
        .join(
            enter => enter.append("g") // Enter selection
                .attr("class", "bar")
                .attr("transform", (d) => `translate(${x0(d.week)},0)`)
                .selectAll("rect")
                .data((d) => keys.map((key) => ({ key, value: d[key] })))
                .join("rect")
                .attr("x", (d) => x1(d.key) || 0)
                .attr("y", height) 
                .attr("width", x1.bandwidth())
                .attr("height", 0) 
                .attr("fill", (d) => color(d.key) as string)
                .transition()
                .duration(duration)
                .delay((d, i) => i * 50) // Delay to stagger bars
                .ease(d3.easeCubic) // Easing function
                .attr("y", (d) => y(d.value))
                .attr("height", (d) => height - y(d.value)),
            update => update // Update selection
                .attr("transform", (d) => `translate(${x0(d.week)},0)`)
                .selectAll("rect")
                .data((d) => keys.map((key) => ({ key, value: d[key] })))
                .join("rect")
                .transition()
                .duration(duration)
                .attr("x", (d) => x1(d.key) || 0)
                .attr("y", (d) => y(d.value))
                .attr("width", x1.bandwidth())
                .attr("height", (d) => height - y(d.value))
                .attr("fill", (d) => color(d.key) as string),
            exit => exit // Exit selection
                .selectAll("rect")
                .transition()
                .duration(duration)
                .attr("y", height)
                .attr("height", 0)
                .remove()
        );

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
        <div className="WeeklyWinComparison">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default WeeklyWinComparison;
