import React from 'react';
import { Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';

interface StatsCardProps {
  title: string;
  choice: string;
  chance: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, choice, chance }) => {
  return (
    <Card>
      <Stat>
        <StatLabel>{title}</StatLabel>
        <StatHelpText>{choice}</StatHelpText>
        <StatNumber>{chance}%</StatNumber>
      </Stat>
    </Card>
  );
};

export default StatsCard;
