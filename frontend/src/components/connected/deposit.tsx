import React from 'react';
import { useAccount } from 'wagmi';
import { Input, InputRightElement, InputLeftElement, Button, InputGroup } from '@chakra-ui/react';
import styles from '../../styles/DepositComponent.module.css';

const DepositComponent: React.FC = () => {
  const { isConnected, address } = useAccount();

  const handleClick = () => {
    console.log('Button clicked!');
  };


  return (
    <div>
      {isConnected && (
          // <Input placeholder='large size' size='lg' />
          <InputGroup size="lg">
            <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
              $
            </InputLeftElement>
            <Input type='number' pr='4.5rem' placeholder='Enter amount' />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                Purchase
              </Button>
            </InputRightElement>
          </InputGroup>
      )}
    </div>
  );
};

export default DepositComponent;