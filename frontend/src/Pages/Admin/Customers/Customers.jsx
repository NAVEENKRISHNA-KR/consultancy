import { Box,  Input, Text, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import styles from "../admin.module.css";
import { SearchIcon } from '@chakra-ui/icons'
import {
  Table,
  Thead,
  Tbody,

  Tr,
  Th,
  
  TableContainer,
} from '@chakra-ui/react'

import CustomerTable from '../../../Components/Admin/Table/CustomersTable/CustomerTable';






const Customers = () => {

  useEffect(() => {
    window.document.title = "Welcome Admin - Customers";
  }, [])

  return (
    <Box className={styles.container}>
      <Text className={styles.heading}>Customers</Text>
      <Box className={styles.containerBox}>
        <Box className={styles.box}>

          
          
        </Box>
        <Box>
          <InputGroup size='sm'>
            <InputLeftElement  pointerEvents='none' children={<SearchIcon color="gray.600"/>} />
            <Input type='tel' placeholder='Search...' borderRadius={"1rem"}/>
          </InputGroup>
        </Box>
      </Box>


      
      <Box>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Orders</Th>          
              </Tr>
            </Thead>
            <Tbody>
              <CustomerTable/>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Customers;
