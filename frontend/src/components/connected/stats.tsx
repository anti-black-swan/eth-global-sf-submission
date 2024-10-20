// import styles from '../../styles/DepositComponent.module.css';
// import React, { useEffect } from 'react';
// import { Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
// import axios from 'axios';
// import StatsCard from './statscard';
// import { Button, Card } from 'react-bootstrap';
// // import styles from '../../styles/DepositComponent.module.css';


// const VaultStats: React.FC = () => {

//   const events = [
//     {
//       title: "Will Ukraine hold Kursk through October 31?",
//       choice: "Yes",
//       chance: 90.1,
//     },
//     {
//       title: "Missouri Presidential Election Winner",
//       choice: "Repuplican",
//       chance: 98.9,
//     },
//     {
//       title: "Israel x Iran peace deal in 2024?",
//       choice: "No",
//       chance: 89.4
//     },
//   ];

//   return (
//     <div className='stats-container'>
//       <p>Top 3 Black Swan Events</p>
      
//       {events.map((event, index) => (
//         <Card className='stat-card'>      
//           <Card.Body>
//             <Card.Title>{event.title}</Card.Title>
//             <Card.Subtitle>{event.choice}</Card.Subtitle>
//             <Card.Text>
//               {event.chance}
//             </Card.Text>    
//           </Card.Body>
//         </Card>
//       ))} 
//     </div>
//   );
// };

// export default VaultStats;



import React from 'react';
import { Card, Row, Col } from 'react-bootstrap'; // Import Row and Col from react-bootstrap

const VaultStats: React.FC = () => {
  const events = [
    {
      title: "Will Ukraine hold Kursk through October 31?",
      choice: "Yes",
      chance: 90.1,
    },
    {
      title: "Missouri Presidential Election Winner",
      choice: "Republican",
      chance: 98.9,
    },
    {
      title: "Israel x Iran peace deal in 2024?",
      choice: "No",
      chance: 89.4,
    },
  ];

  return (
    <div className='stats-container'>
      <p>Top 3 Black Swan Events</p>
      <Row>
        {events.map((event, index) => (
          <Col key={index} md={4} className="mb-4"> {/* Use md={4} for equal width */}
            <Card className='stat-card'>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{event.choice}</Card.Subtitle>
                <Card.Text>{event.chance}% chance</Card.Text>
              </Card.Body>
            </Card>
          </Col>

        ))}
      </Row>
    </div>
  );
};

export default VaultStats;
