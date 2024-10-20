import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot } from "@chakra-ui/react";
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
      <Table variant="simple">
        <TableCaption>Recent Transactions</TableCaption>
        <Thead>
          <Tr>
            <Th>Hash</Th>
            <Th>Time</Th>
            <Th>ETH Value</Th>
          </Tr>
        </Thead>
        <Tbody>
            <Tr>
              <Td></Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionHistory;
