import React from 'react';
import { useAccount } from 'wagmi';
import { Input, InputRightElement, InputLeftElement, Button, InputGroup } from '@chakra-ui/react';

const DepositComponent: React.FC = () => {
  const { isConnected, address } = useAccount();

  function handleClick() {
    console.log(1)
  }

  return (
    <div>
      {isConnected && (
          // <Input placeholder='large size' size='lg' />
          <InputGroup size="lg">
            <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
              $
            </InputLeftElement>
            <Input pr='4.5rem' placeholder='Enter amount' />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                Hello
              </Button>
            </InputRightElement>
          </InputGroup>
      )}
    </div>
  );
};

export default DepositComponent;