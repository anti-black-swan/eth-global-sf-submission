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
} from "@chakra-ui/react";
import { NextPage } from "next";
import EarningsChart from "../components/earnings_chart";
import TransactionHistory from "../components/transhistory";

// Mock transaction data

const Dashboard: NextPage = () => {
  return (
    <>
      <EarningsChart />
      <div className="tx-table-container">
        <TransactionHistory />
      </div>
    </>
  );
};

export default Dashboard;
