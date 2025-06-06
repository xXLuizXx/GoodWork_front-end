import { useContext, useRef } from "react";
import { RiLogoutBoxLine, RiProfileLine } from "react-icons/ri";
import { Flex, Text, Box, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverBody, PopoverCloseButton, Button, Link, Icon, Stack } from "@chakra-ui/react";
import { AuthContext, signOut } from "@/contexts/AuthContext";

interface IProfileProps {
    showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
    const { user } = useContext(AuthContext);
    const initialFocusRef = useRef<HTMLButtonElement | null>(null);

    return (
        <Popover id="popoverProfile" initialFocusRef={initialFocusRef} placement="bottom-end">
            <PopoverTrigger>
                <Flex align="center" cursor="pointer" ml="auto">
                    {showProfileData && (
                        <Box mr={["0", "4"]} textAlign={["center", "right"]}>
                            <Text color="white">{user?.name}</Text>
                            <Text color="white" fontSize="small">{user?.email}</Text>
                        </Box>
                    )}
                    <Avatar border="1px" size="md" src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user?.avatar}` : "../../../Img/icons/avatarLogin.png"} name={user?.name || ''}/>
                </Flex>
            </PopoverTrigger>
            <PopoverContent color="white" bg="#00008B" borderColor="#00BFFF" maxW={["100%", "250px"]}>
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                    <Stack direction={['column', 'row']} spacing={['2', '4']}>
                        <Flex>
                            <Avatar border="1px" size="md" src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user?.avatar}` : "../../../Img/icons/avatarLogin.png"} name={user?.name} />
                        </Flex>
                        <Flex flexDirection="column" justifyContent="center" ml={["0", "2"]} mt={["2", "0"]}>
                            <Text color="white">{user?.name}</Text>
                            <Text color="white" fontSize="small">{user?.email}</Text>
                        </Flex>
                    </Stack>
                </PopoverHeader>
                <PopoverArrow bg="white.800" />
                <PopoverCloseButton />
                <PopoverBody>
                    <Link href="/users/my-profile">
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
                        onClick={signOut}
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
