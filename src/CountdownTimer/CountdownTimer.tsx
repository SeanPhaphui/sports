import React from 'react';
import DateTimeDisplay from './DateTimeDisplay/DateTimeDisplay';
import { useCountdown } from '../Utils/useCountdown';
import './CountdownTimer.css';
import { getNextFridayNoon, isWithinLockInPeriod } from '../Utils/BetUtils';

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
        <DateTimeDisplay value={days} type={'Days'} isDanger={days < 1} />
        <div>:</div>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={days < 1} />
        <div>:</div>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={days < 1} />
        <div>:</div>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={days < 1} />
    </div>
  );
};

const CountdownTimer: React.FC = () => {
  const upcomingFridayNoon = getNextFridayNoon();

  const [days, hours, minutes, seconds] = useCountdown(upcomingFridayNoon);

  const now = new Date();
  if (isWithinLockInPeriod(now)) {
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
