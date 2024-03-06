// PercentageCard.js
import React, { useEffect, useState } from 'react';
import '../css/PercentageCard.css';

const PercentageCard = ({ percentage }) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    setFillHeight(validPercentage);
  }, [validPercentage]);

  const liquidClassName = validPercentage >= 75 ? 'liquid green' : 'liquid red';

  return (
    <>
    <div className="percentage-card">
      <div className="circle">
        <div
          className={liquidClassName}
          style={{
            height: `${fillHeight}%`,
          }}
        ></div>
        <div className="percentage-text">{`${validPercentage}%`}</div>
      </div><br></br>
      <h3>Attendence</h3> 

    </div>

    <h3>Class : CSE-B</h3>

    </>    
  );
};

export default PercentageCard;