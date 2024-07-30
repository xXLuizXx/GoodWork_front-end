import { Icon, Link, Stack } from "@chakra-ui/react";
import { useCategories } from "@/services/hooks/Categories/useCategories";
import { FcNext } from "react-icons/fc";

export function Categories(){
    const { data } = useCategories();
    
    return (
        <Stack spacing="4" mt="8" align="stretch">
            {data?.categories.map(category => (
                <Link 
                    key={category.id} 
                    mt="2" 
                    ml="4" 
                    borderLeft="2px solid" 
                    borderColor="gray.200" 
                    mr="4" 
                    display="flex" 
                    alignItems="center"
                    _hover={
                        { bgColor: 'gray.200' }
                    }
                >
                    <Icon as={FcNext} fontSize="20" w="6" h="6"/>
                    {category.name}
                </Link>
            ))}
        </Stack>
    );
}
