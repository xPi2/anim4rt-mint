import React, { useState, useEffect } from "react";

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    new Date().getTime() - countDownDate
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  return getTimeValues(countDown);
};

const getTimeValues = (countDown) => {
  const day = 86400 * 1000;
  const hour = 3600 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(countDown / day);
  const hours = Math.floor(countDown / hour) % 24;
  const minutes = Math.floor(countDown / minute) % 60;
  const seconds = Math.floor(countDown / 1000) % 60;

  return [days, hours, minutes, seconds];
};

const CountDown = ({ endTime }) => {
  const [days, hours, minutes, seconds] = useCountdown(endTime);

  return (
    <div className="flex flex-row gap-3 md:gap-5 text-center self-center">
      <div className="flex flex-col p-2 rounded-box items-center">
        <span className="countdown font-mono text-3xl md:text-5xl">
          <span
            style={{ "--value": Math.max(days, 0) } as React.CSSProperties}
          ></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 items-center">
        <span className="countdown font-mono text-3xl md:text-5xl">
          <span
            style={{ "--value": Math.max(hours, 0) } as React.CSSProperties}
          ></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 items-center">
        <span className="countdown font-mono text-3xl md:text-5xl">
          <span
            style={{ "--value": Math.max(minutes, 0) } as React.CSSProperties}
          ></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 items-center">
        <span className="countdown font-mono text-3xl md:text-5xl">
          <span
            style={{ "--value": Math.max(seconds, 0) } as React.CSSProperties}
          ></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default CountDown;
