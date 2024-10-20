import React from 'react';
import { useAccount } from 'wagmi';
import { Input } from '@chakra-ui/react';

const DepositComponent: React.FC = () => {
  const { isConnected, address } = useAccount();

  return (
    <div>
      {isConnected && (
          <Input placeholder='large size' size='lg' />
      )}
    </div>
  );
};

export default DepositComponent;