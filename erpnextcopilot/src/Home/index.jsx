
import { ChatView } from './Component/ChatView'
import { nanoid } from 'nanoid'
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Spacer,
  Center
} from '@chakra-ui/react'
import { UserContext } from "../Context/UserContext";
import React, { useContext } from "react";
import bot_logo from '../../src/assets/bot.png';
export const HomePage = () => {

  const { currentUser } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  
  const onLogoutClick = () => {
    logout();
  }

  return (
    <>
      <Box bg={useColorModeValue('purple.100', 'purple.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }} >
            <Avatar name={""} size={"md"} src={bot_logo} />
            <Box>ERPNext CoPilot</Box>
          </HStack>

          <Spacer />
          <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar name={currentUser} size={"md"} src={""} />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar name={currentUser} size={"sm"} src={""} />
                  </Center>
                  <br />
                  <Center>
                    <p>{currentUser}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
                </MenuList>
              </Menu>
        </Flex>
      </Box>
      <ChatView sessionID={nanoid()} />
    </>
  )
}
