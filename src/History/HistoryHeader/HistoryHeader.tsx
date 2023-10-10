import { AppBar, Select, MenuItem, Toolbar, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./HistoryHeader.css";
import { fetchAvailableYearsAndWeeks, fetchOutcomes } from "../../firebaseConfig";

interface HistoryHeaderProps {
    onOutcomesFetched: (outcomes: any) => void; // Assuming outcomes is of type 'any', modify as needed
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onOutcomesFetched }) => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [yearsAndWeeks, setYearsAndWeeks] = useState<{ [year: string]: string[] }>({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchAvailableYearsAndWeeks();
            setYearsAndWeeks(data);

            // Find the highest year and set it as the default selected year
            const highestYear = Math.max(...Object.keys(data).map((year) => parseInt(year)));
            if (highestYear) {
                setSelectedYear(highestYear.toString());

                // Find the highest week for that year and set it as the default selected week
                const highestWeek = Math.max(
                    ...data[highestYear.toString()].map((week) =>
                        parseInt(week.replace("week", ""))
                    )
                );
                if (highestWeek) {
                    setSelectedWeek(`week${highestWeek}`);
                }
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchOutcomesData = async () => {
            if (selectedYear && selectedWeek) {
                const outcomes = await fetchOutcomes({ year: selectedYear, week: selectedWeek });
                // Pass the outcomes back to the parent component
                onOutcomesFetched(outcomes);
            }
        };

        fetchOutcomesData();
    }, [selectedYear, selectedWeek]);

    return (
        <div className="HistoryHeader">
            <AppBar className="top-bar" position="sticky" color="transparent">
                <Toolbar className="top">
                    <div>History</div>
                    <div className="buttons">
                        <FormControl sx={{ minWidth: "auto" }} size="small">
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value as string)}
                            >
                                {Object.keys(yearsAndWeeks).map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedYear && (
                            <FormControl sx={{ minWidth: "auto" }} size="small">
                                <Select
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value as string)}
                                >
                                    {yearsAndWeeks[selectedYear]?.map((week) => (
                                        <MenuItem key={week} value={week}>
                                            {`Week ${week.replace("week", "")}`}{" "}
                                            {/* This will convert "week6" to "Week 6" */}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default HistoryHeader;
