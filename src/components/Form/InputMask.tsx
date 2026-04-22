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
    useColorModeValue,
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
                <ChakraInput
                        as={ReactInputMask}
                        name={name}
                        id={name}
                        mask={mask}
                        maskChar={maskChar}
                        boxShadow="2xl"
                        borderRadius="full"
                        focusBorderColor="blue.400"
                        bgColor={inputBg}
                        variant="filled"
                        _hover={{ bgColor: inputHover }} 
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
