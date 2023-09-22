import React from 'react';
import DateTimeDisplay from './DateTimeDisplay/DateTimeDisplay';
import { useCountdown } from '../Utils/useCountdown';
import './CountdownTimer.css';

const ExpiredNotice: React.FC = () => {
  return (
    <div className="expired-notice">
      Bets Are Locked
    </div>
  );
};

interface ShowCounterProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ShowCounter: React.FC<ShowCounterProps> = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <div>:</div>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <div>:</div>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <div>:</div>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
    </div>
  );
};

const CountdownTimer: React.FC = () => {
  function getNextFridayNoon(): number {
    const now = new Date();
    now.setHours(12, 0, 0, 0);  // Set time to 12:00:00.000
    const daysUntilNextFriday = (5 + 7 - now.getDay()) % 7 || 7; // Calculate how many days until next Friday
    now.setDate(now.getDate() + daysUntilNextFriday); // Adjust to next Friday
    return now.getTime();
  }

  function isWithinExpirationPeriod(): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const hour = now.getHours();

    // Return true if it's Friday after 12pm or it's Saturday or it's Sunday before 12pm
    return (dayOfWeek === 5 && hour >= 12) || dayOfWeek === 6 || (dayOfWeek === 0 && hour < 12);
  }

  const upcomingFridayNoon = getNextFridayNoon();

  const [days, hours, minutes, seconds] = useCountdown(upcomingFridayNoon);

  if (isWithinExpirationPeriod()) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
