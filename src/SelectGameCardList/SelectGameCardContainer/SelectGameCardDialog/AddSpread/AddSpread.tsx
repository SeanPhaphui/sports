import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./AddSpread.css";

interface AddSpreadProps {
    spread: string | undefined;
    spreadSign: string | undefined;
    disabled: boolean;
    onAddSpreadChange: () => void;
}

const AddSpread: React.FC<AddSpreadProps> = (props) => {
    const { spread, spreadSign, disabled, onAddSpreadChange } = props;

    const [spreadAndSign, setSpreadAndSign] = useState<string>("");

    useEffect(() => {
        if (spread && spreadSign) {
            setSpreadAndSign(spreadSign + spread);
        }
    }, [spread, spreadSign]);

    return (
        <div className="AddSpread">
            <Button
                className="add"
                variant="contained"
                disabled={disabled}
                onClick={() => {
                    onAddSpreadChange();
                }}
            >
                {"Add " + spreadAndSign + " Spread"}
            </Button>
        </div>
    );
};

export default AddSpread;
