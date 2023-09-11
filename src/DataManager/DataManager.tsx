import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useRef } from "react";
import { Bet } from "../Utils/Utils";

interface ContractDialogProps {
    bets: Bet[];
    restoreBets: (bets: Bet[]) => void;
    clearBets: () => void;
}

const DataManager: React.FC<ContractDialogProps> = (props) => {
    const { bets, restoreBets, clearBets } = props;
    const exportToJSON = () => {
        const jsonContent = JSON.stringify(bets, null, 2);
        const dataURI =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(jsonContent);

        const link = document.createElement("a");
        link.href = dataURI;
        link.download = "bets.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const convertToDayjs = (dateString: string): Dayjs => {
        return dayjs(dateString);
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const jsonContent = reader.result as string;
                const restoredBets: Bet[] = JSON.parse(
                    jsonContent,
                    (key, value) => {
                        if (key === "startDate" || key === "expireDate") {
                            return convertToDayjs(value);
                        }
                        return value;
                    }
                );

                // Use the restoredContracts array as needed
                console.log(restoredBets);
                restoreBets(restoredBets);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="DataManager">
            <Button onClick={exportToJSON}>Save</Button>
            <Button component="label" htmlFor="fileInput">
                Restore
                <input
                    type="file"
                    id="fileInput"
                    accept=".json"
                    style={{ display: "none" }}
                    ref={inputFileRef}
                    onChange={handleFileChange}
                />
            </Button>
            <Button onClick={clearBets}>Clear</Button>
        </div>
    );
};

export default DataManager;