import { Icon, Link, Menu, MenuButton, MenuItem, MenuList, Stack, border } from "@chakra-ui/react";
import { ICategorie, getCategories, useCategories } from "@/services/hooks/Categories/useCategories";
import { FcNext } from "react-icons/fc";


export function Categories(){
    const { data } = useCategories()
    console.log(data);
    { data?.categories.map(category => { 
        console.log(category);
    })}
    return (
        <Stack spacing="4" mt="8" align="stretch">
            <Stack borderRadius="full" h="10" w="100%" _hover={{ bgColor: 'gray.200' }} >
            { data?.categories.map(category => { 
                return(
                    <Link mt="2" ml="4" borderLeft="2" mr="4" display="flex" alignItems="center">
                        <Icon as={FcNext} fontSize="20" w="6" h="6"/>
                        {category.name}
                    </Link>
                );
            })}
            </Stack>
        </Stack>
    );
    
}