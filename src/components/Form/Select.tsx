import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
    Select as ChakraSelect,
    SelectProps as ChakraSelectProps,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputLeftElement,
    useColorModeValue,
} from "@chakra-ui/react";

export interface ISelectOption {
    value: string;
    label: string;
}

interface ISelectProps extends ChakraSelectProps {
    name: string;
    placeholder: string;
    options: ISelectOption[];
    label?: string;
    error?: FieldError;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, ISelectProps> = (
    { name, placeholder, options, label, error = null, ...rest },
    ref,
): JSX.Element => {
    const inputBg = useColorModeValue("gray.100", "gray.700");
    const inputHover = useColorModeValue("gray.200", "gray.600");

    return (
        <FormControl isInvalid={!!error}>
        {!!label && (
            <FormLabel htmlFor={name} id={`label-for-${name}`}>
            {label}
            </FormLabel>
        )}

            <InputGroup>
                <InputLeftElement pointerEvents='none' fontSize="medium">
                </InputLeftElement>
                <ChakraSelect
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    boxShadow="2xl"
                    borderRadius="full"
                    focusBorderColor="blue.400"
                    bgColor={inputBg}
                    variant="filled"
                    _hover={{ bgColor: inputHover }} 
                    size="lg"
                    ref={ref}
                    {...rest}
                >
                    {options.map(option => {
                    return (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    );
                    })}
                </ChakraSelect>
                {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </InputGroup>
        </FormControl>
  );
};

const Select = forwardRef(SelectBase);

export { Select };
