import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import { NextPage } from 'next'
import EarningsChart from '../components/earnings_chart';

// Mock transaction data
const transactions = [
    { amount: '5.0 ETH', hash: '0x123...abc', timestamp: 1632857600 },
    { amount: '2.5 ETH', hash: '0x456...def', timestamp: 1632934000 },
    { amount: '3.5 ETH', hash: '0x556...xyz', timestamp: 1632932200 }
  ];

const Dashboard: NextPage = () => {
    return(
        <>
        <EarningsChart/>
        <div className="tx-table-container">
            <TableContainer className='tx-table'>
            <Table variant='striped' colorScheme='gray' size='sm'>
                <TableCaption>Transaction History</TableCaption>
                <Thead>
                <Tr>
                    <Th>Amount</Th>
                    <Th>Hash</Th>
                    <Th isNumeric>Timestamp</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {transactions.map((tx, index) => (
                        <Tr key={index}>
                        <Td>{tx.amount}</Td>
                        <Td>{tx.hash}</Td>
                        <Td isNumeric>{tx.timestamp}</Td>
                        </Tr>
                    ))}
                </Tbody>        
            </Table>
        </TableContainer>
        </div>
        </>
    )
}

export default Dashboard;