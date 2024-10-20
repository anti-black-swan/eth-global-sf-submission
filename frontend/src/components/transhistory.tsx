import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Text,
  Link,
  Box,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const TransactionHistory = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/dune-query?userAddress=0x46EF04e08a7C7E93CEA599c70715f9c320c4B99b"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red.500">Error: {error}</Text>;
  if (!data || !data.transaction_hash || data.transaction_hash.length === 0)
    return <Text>No data available</Text>;

  return (
    <Box>
      <Heading mb={4}>Recent Vault Transactions</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Hash</Th>
              <Th>Block Time</Th>
              <Th>ETH Value</Th>
              <Th>Gas Used</Th>
              <Th>Gas Price (Gwei)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.transaction_hash.map((hash: any, index: any) => (
              <Tr key={hash}>
                <Td>
                  <Link
                    href={`https://polygonscan.com/tx/${hash}`}
                    isExternal
                    color="blue.500"
                  >
                    {hash.slice(0, 10)}...{hash.slice(-8)}{" "}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Td>
                <Td>{new Date(data.block_time[index]).toLocaleString()}</Td>
                <Td>{data.eth_value[index]}</Td>
                <Td>{data.gas_used[index]}</Td>
                <Td>{data.gas_price_gwei[index].toFixed(6)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;
