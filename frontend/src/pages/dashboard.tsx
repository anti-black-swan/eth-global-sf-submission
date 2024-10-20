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
import TransactionHistory from '../components/transhistory';

const Dashboard: NextPage = () => {
    return(
        <div className="tx-table-container">
            <TransactionHistory />
        </div>
    )
}

export default Dashboard;