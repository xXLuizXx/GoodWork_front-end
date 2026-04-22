import { useContext, useRef } from "react";
import { RiLogoutBoxLine, RiProfileLine } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
    Flex, Text, Avatar, Popover, PopoverTrigger, PopoverContent,
    PopoverHeader, PopoverArrow, PopoverBody, PopoverCloseButton,
    Button, Link, Icon, Stack, useColorMode, useColorModeValue,
} from "@chakra-ui/react";
import { AuthContext, signOut } from "@/contexts/AuthContext";

interface IProfileProps {
    showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
    const { user } = useContext(AuthContext);
    const { colorMode, toggleColorMode } = useColorMode();
    const initialFocusRef = useRef<HTMLButtonElement | null>(null);

    const popoverBg = useColorModeValue("#00008B", "gray.800");
    const popoverBorder = useColorModeValue("#00BFFF", "gray.600");
    const buttonHover = useColorModeValue("blue.700", "gray.700");

    return (
        <Popover id="popoverProfile" initialFocusRef={initialFocusRef} placement="bottom-end">
            <PopoverTrigger>
                <Flex align="center" cursor="pointer" ml="auto">
                    {showProfileData && (
                        <Flex mr={["0", "4"]} direction="column" textAlign={["center", "right"]}>
                            <Text color="white">{user?.name}</Text>
                            <Text color="white" fontSize="small">{user?.email}</Text>
                        </Flex>
                    )}
                    <Avatar
                        border="1px"
                        size="md"
                        src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user?.avatar}` : "../../../Img/icons/avatarLogin.png"}
                        name={user?.name || ""}
                    />
                </Flex>
            </PopoverTrigger>

            <PopoverContent bg={popoverBg} borderColor={popoverBorder} maxW={["100%", "250px"]}>
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                    <Stack direction={["column", "row"]} spacing={["2", "4"]}>
                        <Avatar
                            border="1px"
                            size="md"
                            src={user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/avatars/${user?.avatar}` : "../../../Img/icons/avatarLogin.png"}
                            name={user?.name}
                        />
                        <Flex flexDirection="column" justifyContent="center" ml={["0", "2"]} mt={["2", "0"]}>
                            <Text color="white" fontWeight="bold" fontSize="sm">{user?.name}</Text>
                            <Text color="whiteAlpha.700" fontSize="xs">{user?.email}</Text>
                        </Flex>
                    </Stack>
                </PopoverHeader>

                <PopoverArrow bg={popoverBg} />
                <PopoverCloseButton color="white" />

                <PopoverBody>
                    <Link href="/users/my-profile" style={{ textDecoration: "none" }}>
                        <Button
                            variant="ghost"
                            justifyContent="start"
                            leftIcon={<Icon as={RiProfileLine} color="white" />}
                            color="white"
                            w="100%"
                            h="8"
                            mb="1"
                            _hover={{ bg: buttonHover }}
                        >
                            Perfil
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        justifyContent="start"
                        leftIcon={<Icon as={colorMode === "dark" ? MdLightMode : MdDarkMode} color="white" />}
                        color="white"
                        w="100%"
                        h="8"
                        mb="1"
                        onClick={toggleColorMode}
                        _hover={{ bg: buttonHover }}
                    >
                        {colorMode === "dark" ? "Tema claro" : "Tema escuro"}
                    </Button>

                    <Button
                        variant="ghost"
                        justifyContent="start"
                        leftIcon={<Icon as={RiLogoutBoxLine} color="white" />}
                        color="white"
                        w="100%"
                        h="8"
                        onClick={signOut}
                        _hover={{ bg: buttonHover }}
                    >
                        Sair
                    </Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export { Profile };
