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
                    bgColor="gray.100" 
                    variant="filled" 
                    _hover={{ bgColor: 'gray.200' }} 
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
