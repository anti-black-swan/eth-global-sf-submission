import React, { useEffect } from 'react';
import { StatGroup } from '@chakra-ui/react';
import axios from 'axios';
import StatsCard from './statscard';
// import styles from '../../styles/DepositComponent.module.css';

const VaultStats: React.FC = () => {

  const events = [
    {
      title: "Will Ukraine hold Kursk through October 31?",
      choice: "Yes",
      chance: 90.1,
    },
    {
      title: "Missouri Presidential Election Winner",
      choice: "Repuplican",
      chance: 98.9,
    },
    {
      title: "Israel x Iran peace deal in 2024?",
      choice: "No",
      chance: 89.4
    },
  ];

  return (
    <div>
      <StatGroup>
        {events.map((event, index) => (
          <StatsCard
            key={index}
            title={event.title}
            choice={event.choice}
            chance={event.chance}
          />
        ))}
      </StatGroup>
    </div>
  );
};

export default VaultStats;