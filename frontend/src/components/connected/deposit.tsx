import React from 'react';
import { useAccount } from 'wagmi';
import { Input, InputRightElement, InputLeftElement, Button, InputGroup } from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import styles from '../../styles/DepositComponent.module.css';

const DepositComponent: React.FC = () => {
  const { isConnected, address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();


  const handleClick = () => {
    addRecentTransaction({
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      description: 'test',
    });
  };


  return (
    <div>
      {isConnected && (
        <div>
          $<input type='number' placeholder='00'/>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            Purchase
          </Button>
        </div>
        
          // <Input placeholder='large size' size='lg' />
          // <InputGroup size="lg">
          //   <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
          //     $
          //   </InputLeftElement>
          //   <Input type='number' pr='4.5rem' placeholder='Enter amount' />
          //   <InputRightElement width='4.5rem'>
          //     <Button h='1.75rem' size='sm' onClick={handleClick}>
          //       Purchase
          //     </Button>
          //   </InputRightElement>
          // </InputGroup>
      )}
    </div>
  );
};

export default DepositComponent;