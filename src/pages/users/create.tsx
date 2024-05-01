import { Input } from "@/components/Form/Input";
import { Button, Flex, Grid, GridItem, InputGroup, Link, Select, SimpleGrid, Stack } from "@chakra-ui/react";


export default function Create(){

    return(
        <Flex
            as="form" 
            w="100vw"
            h="100vh" 
            align="center" 
            justify="center"
        >
            <Stack
                w="35%"
                h="80%"
                spacing="1"
                align="center"
            >
                <Flex 
                    width="100%" 
                    maxWidth={1050}
                    borderRadius={20}
                    border="1px"
                    pt="6%"
                    pl="4%"
                    pr="5%"
                    pb="6%"
                    borderColor="blue.400"
                >
                    <Grid
                        gap="1"
                        h='100%'
                        templateAreas={`"row1 row2"
                                        "row3 row3"
                                        "row4 row5"
                                        "row6 row7"
                                        "row8 row9"
                                        "row10 row11"
                                    `}
                        gridTemplateRows={'50px 1fr 90px'}
                        gridTemplateColumns={'310px 1fr'}
                        minWidth={[200, 250]}
                    >
                        
                        <GridItem pl="2" area={'row1'}>
                            <Input
                                name="Nome"
                                type="Nome"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400"
                                bgColor="gray.100"
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Nome Completo"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row2'}>
                            <Input
                                name="surname"
                                type="surname"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Sobrenome"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row3'}>
                            <Input
                                name="email"
                                type="email"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="E-mail"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row4'}>
                            <Input
                                name="password"
                                type="password"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Senha"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row5'}>
                            <Input
                                name="confirmPassword"
                                type="password"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Confirmar senha"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row6'}>
                            <Select 
                                boxShadow="2xl"
                                borderRadius="full"
                                size='lg'
                                focusBorderColor="blue.400"
                                variant="ghost" 
                                bgColor="gray.100" 
                                _hover={{ bgColor: 'gray.200' }} 
                                placeholder='É empregado?'
                            >
                                <option value='sim'>Sim</option>
                                <option value='nao'>Não</option>
                            </Select>
                        </GridItem>
                        <GridItem pl="2" area={'row7'}>
                            <Input
                                name="identifier"
                                type="identifier"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="CPF/CNPJ"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row8'}>
                            <Input
                                name="road"
                                type="road"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Rua"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row9'}>
                            <Input
                                name="number"
                                type="number"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Número"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row10'}>
                            <Input
                                name="neighborhood"
                                type="neighborhood"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="Bairro"
                            />
                        </GridItem>
                        <GridItem pl="2" area={'row11'}>
                            <Input
                                name="identifier"
                                type="identifier"
                                boxShadow="2xl"
                                borderRadius="full"
                                focusBorderColor="blue.400" 
                                bgColor="gray.100" 
                                variant="filled" 
                                _hover={{ bgColor: 'gray.200' }} 
                                size="lg" 
                                placeholder="CPF/CNPJ"
                            />
                        </GridItem>
                    </Grid>
                </Flex>
                <Flex 
                    width="100%" 
                    maxWidth={1050} 
                    p="8" 
                    borderRadius={10} 
                    flexDir="column"
                >
                    <Stack spacing='1'>
                        <SimpleGrid
                            gap="2"
                            w="100%"
                            flex="1"
                            minChildWidth="90px"
                        >
                            <Button 
                                boxShadow="dark-lg" 
                                type="submit"  
                                borderRadius="full" 
                                mt="4" 
                                colorScheme="blue" 
                                w='100%' 
                                h="12" 
                            >
                                Salvar
                            </Button>
                            <Link href="/">
                                <Button
                                    boxShadow="dark-lg" 
                                    type="submit"  
                                    borderRadius="full" 
                                    mt="4" 
                                    colorScheme="blue" 
                                    w='100%' 
                                    h="12"  
                                >
                                    Cancelar
                                </Button>
                            </Link>
                        </SimpleGrid>
                    </Stack>
                </Flex>
            </Stack>
        </Flex>
    );

}