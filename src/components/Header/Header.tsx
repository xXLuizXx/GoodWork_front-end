import { Flex, Input, Text, Icon, HStack, VStack, useBreakpointValue} from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { Profile } from "./Profile";

interface IProfileProps {
    showProfileData: boolean;
}
function Header(): JSX.Element{
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
      });

    return(
        <Flex
            as="header"
            w="100%"
            maxWidth={1680}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
            bgColor="#0000CD"
            boxShadow="dark-lg"
            borderRadius="full"
        >
            <Text
                fontSize="3xl"
                fontWeight="bold"
                letterSpacing="tigth"
                w="64"
            >
                GoodWork
                <Text as="span" ml="1" color="blue">.</Text>
            </Text>
                
            <Flex
                as="label"
                flex="1"
                py="4"
                px="8"
                ml="6"
                maxWidth={1000}
                alignSelf="center"
                color="gray.50"
                position="relative"
                bg="gray.200"
                borderRadius="full"
            >
                <Input
                    color="white"
                    variant="unstyled"
                    px="4"
                    mr="4"
                    placeholder="Buscar"
                    _placeholder={{
                        color: "gray.500"
                    }}
                />
                <Icon as={RiSearchLine} fontSize="20"/>
            </Flex>

            <Flex
                align="center"
                ml="auto"
            >
                <HStack 
                    spacing="4"
                    mx="8"
                    pr="8"
                    py="3"
                    color="gray.50"
                    borderRightWidth={1}
                    borderColor="gray.100"

                >
                </HStack>
                <Flex align="center">
                    <Profile showProfileData={isWideVersion} />
                </Flex>
            </Flex>

            <Flex>
                <VStack 
                    w="100%"
                    mt="40"
                    spacing="10"
                    mx="8"
                    pr="8"
                    py="3"
                    color="gray.900"
                    borderRightWidth={1}
                    borderColor="gray.100"

                >
                </VStack>
            </Flex>
        </Flex>
        
        
    );
}

export { Header };