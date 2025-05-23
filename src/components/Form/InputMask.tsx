import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import ReactInputMask, { Props } from "react-input-mask";

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input as ChakraInput,
    InputProps,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";

interface IInputMaskProps extends InputProps {
    name: string;
    mask: string;
    maskChar: string;
    label?: string;
    error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputMaskProps> = (
    { name, mask, maskChar, label, error = null, ...rest },
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
                <ChakraInput
                        as={ReactInputMask}
                        name={name}
                        id={name}
                        mask={mask}
                        maskChar={maskChar}
                        boxShadow="2xl"
                        borderRadius="full"
                        focusBorderColor="blue.400" 
                        bgColor="gray.100" 
                        variant="filled" 
                        _hover={{ bgColor: 'gray.200' }} 
                        size="lg"
                        ref={ref}
                        {...rest}
                />
                {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </InputGroup>    
        </FormControl>
    );
};

const InputMask = forwardRef(InputBase);

export { InputMask };
