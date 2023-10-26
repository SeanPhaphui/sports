import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface WinLossRatioProps {
    wins: number;
    losses: number;
}

const WinLossRatio: React.FC<WinLossRatioProps> = ({ wins, losses }) => {
    const total = wins + losses;
    const winPercentage = (wins / total) * 100;
    const lossPercentage = 100 - winPercentage;
    console.log(winPercentage)
    console.log(lossPercentage)

    return (
        <Box position="relative" display="inline-flex" width={200} height={200}>
            {/* Loss circle */}
            <CircularProgress 
                variant="determinate" 
                value={lossPercentage -2} 
                size="100%" 
                thickness={3} 
                color="secondary"
                style={{ position: 'absolute', transform: `scaleX(-1) rotate(-86deg)` }}
                sx={{ 
                    circle: { 
                        strokeLinecap: 'round',
                        stroke: "#ef4035"  // Lose color
                    } 
                }}
            />

            {/* Win circle */}
            <CircularProgress 
                variant="determinate" 
                value={winPercentage-3} 
                size="100%" 
                thickness={3} 
                color="primary"
                style={{ position: 'absolute', transform: `rotate(274deg)`}}
                sx={{ 
                    circle: { 
                        strokeLinecap: 'round',
                        stroke: "#2ecc71"  // Win color
                    } 
                }}
            />

            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4" component="div">
                    {(wins / losses).toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};

export default WinLossRatio;
