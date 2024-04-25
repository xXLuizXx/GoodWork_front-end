import { useContext, useRef } from "react";
import { RiLogoutBoxLine, RiProfileLine } from "react-icons/ri";

import { Flex, Text, Box, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverBody, PopoverCloseButton, Button, Link, Icon, SimpleGrid, Stack } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";


interface IProfileProps {
  showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
  const { user } = useContext(AuthContext);
  const initialFocusRef = useRef();

  return (
    <Popover
        id="propoverProfile"
        initialFocusRef={initialFocusRef}
        placement="bottom-end"
    >
        <PopoverTrigger>
            <Flex align="center" cursor="pointer" ml="auto">
                
                        
                    {showProfileData && (
                        <Box mr="4" textAlign="right">
                            <Text color="white">{ user?.name} </Text>
                            <Text color="white" fontSize="small"> { user?.email } </Text>
                        </Box>
                    )}

                    <Avatar
                        border= "1px"
                        size="md"
                        name={user?.name}
                    />
            </Flex>
        </PopoverTrigger>
        <PopoverContent
            color="white"
            bg="#00008B"
            borderColor="#00BFFF"
            maxW="250"
        >
            <PopoverHeader pt={4} fontWeight="bold" border="0">
                <Stack direction={['column', 'row']}>
                    <Flex>
                        <Avatar
                            border= "1px"
                            size="md"
                            name={user?.name}
                        />    
                    </Flex>  
                    <Flex>
                        <Text color="white">{user?.name}
                            <Text color="white" fontSize="small">
                                {user?.email}
                            </Text>
                        </Text>
                        
                    </Flex>
                </Stack>
            </PopoverHeader>

            <PopoverArrow bg="white.800" />
            <PopoverCloseButton />

            <PopoverBody>
                <Link href="/users/profile">
                    <Button
                    justifyContent="start"
                    leftIcon={<Icon as={RiProfileLine} />}
                    colorScheme="white"
                    w="100%"
                    h="7"
                    mb="2"
                    _hover={{ bg: "blue.300" }}
                    >
                    Perfil
                    </Button>
                </Link>
                <Button
                    justifyContent="start"
                    leftIcon={<Icon as={RiLogoutBoxLine} />}
                    colorScheme="white"
                    w="100%"
                    h="7"
                    _hover={{ bg: "blue.300" }}
                >
                    Sair
                </Button>
            </PopoverBody>
        </PopoverContent>
    </Popover>
  );
}

export { Profile };
