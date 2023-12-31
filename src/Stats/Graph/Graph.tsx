import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Graph.css";
import { UserBetsV2, Bet } from "../../Utils/Utils";
import { calculateUserWins } from "../../Utils/BetUtils";

interface GraphProps {
    userBets: UserBetsV2[];
}

const Graph: React.FC<GraphProps> = ({ userBets }) => {
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

        // Update SVG and D3 Dimensions
        const svgWidth = 500;
        const svgHeight = 125;
        const margin = { top: 20, right: 150, bottom: 20, left: 20 }; // adjusted margins
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const keys = userBets.map((user) => user.displayName);

        // Set up the SVG dimensions and create a group to contain all elements
        const svg = d3
            .select(svgRef.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        // Append rectangles to a specific group
        const barsGroup = svg.append("g");

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
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .attr("fill", "white")
            .text((d, i, nodes) => {
                let weekStr = d as string;  // Cast the unknown type to string
                return `Week ${weekStr.replace("week", "")}`;
            });

        // Y Axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .attr("fill", "white");

        // Color Legend
        const legend = svg
            .selectAll(".legend")
            .data(keys)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend
            .append("rect")
            .attr("x", width + 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", (d) => color(d) as string); // Use the color scale with the current data value

        legend
            .append("text")
            .attr("x", width + 35)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text((d) => d)
            .attr("fill", "white");
    }, [userBets]);

    return (
        <div className="Graph">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Graph;
