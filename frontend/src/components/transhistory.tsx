import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const TransactionHistory: React.FC = () => {
    
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dune-query");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(data)

  return (
    <TableContainer>
      <Heading>Recent Transactions</Heading>
      <Table variant="simple">
        {/* <TableCaption>Recent Transactions</TableCaption> */}
        <Thead>
          <Tr>
            <Th>Hash</Th>
            <Th>Time</Th>
            <Th>ETH Value</Th>
          </Tr>
        </Thead>
        <Tbody>
            <Tr>
              <Td>{data && data[0].transaction_hash}</Td>
              <Td>{data && data[0].block_time}</Td>
              <Td>{data && data[0].eth_value}</Td>
            </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionHistory;