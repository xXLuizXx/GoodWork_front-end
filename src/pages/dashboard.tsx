import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar";
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Flex, Grid, Heading, IconButton, Image, SimpleGrid, Stack, Text, VStack, Wrap, WrapItem,} from "@chakra-ui/react";
import { GrUserAdd, GrFormView } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Dashboard(){
    return (
        <Flex direction="column" h="100vh">
            <Header/>

            <Flex w="100%" my="8" maxWidth={1480} mx="auto" px="4">
                <Sidebar/>
                    <SimpleGrid
                        gap="2"
                        w="100%"
                        flex="1"
                        minChildWidth={[200, 250]}
                        >
                        
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                        <Card boxShadow="dark-lg" maxW="md" h="96">
                            <CardHeader p="2.5">
                                <Flex>
                                    <Flex flex="1" gap="4" alignItems="center">
                                        <Avatar name="avatar" src="./Img/icons/empresaTeste.jpg"/>
                                        <Box>
                                            <Heading size="sm">
                                                <Text fontSize="14">
                                                    Empresa Teste
                                                </Text>
                                            </Heading>
                                            <Text fontSize="12">Criador Teste, Teste</Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="gray"
                                        aria-label="See menu"
                                        icon={<BsThreeDotsVertical />}
                                    />
                                </Flex>
                            </CardHeader>
                            <CardBody whiteSpace="1" h="10">
                                <VStack spacing="2" 
                                        alignItems="center"
                                        height="100%"
                                >
                                    <Text textAlign="justify" fontSize="12" noOfLines={4}>
                                        Buscamos uma(um) assistente administrativo responsável por fornecer suporte
                                        a nossos gerentes e funcionários, auxiliar nas necessidades diárias de escritório e 
                                        gerenciar as atividades administrativas gerais de nossa empresa.
                                    </Text>
                                    <Image
                                        maxW="50%"                             
                                        src="./Img/icons/bannerVaga2.png"
                                    />
                                </VStack>
                                
                            </CardBody>
                            
                            <CardFooter
                                alignItems="center"
                                p="2.5"
                                pt="1"
                            >
                                <SimpleGrid
                                    gap="2"
                                    w="100%"
                                    flex="1"
                                    minChildWidth="90px"
                                    >
                                    <Button variant="ghost" leftIcon={<GrUserAdd color="green"/>} size='xs'>Concorrer</Button>
                                    <Button variant="ghost"leftIcon={<GrFormView color="blue"/>} size='xs'>Visualizar</Button>
                                </SimpleGrid>
                                        
                             </CardFooter>
                        </Card>
                    </SimpleGrid>
            </Flex>
        </Flex>
    );
}