import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { CiUser } from "react-icons/ci";

interface IInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  { name, label, error = null, ...rest },
  ref,
): JSX.Element => {
  return (
    <FormControl isInvalid={!!error}>
      <InputGroup>
        <InputLeftElement pointerEvents='none' fontSize="medium">
        </InputLeftElement>
        <ChakraInput
          name={name}
          id={name}
          focusBorderColor="pink.500"
          bg="gray.900"
          variant="filled"
          _hover={{
            bg: "gray.900",
          }}
          size="lg"
          ref={ref}
          {...rest}
        />
        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </InputGroup>
    </FormControl>
  );
};

const Input = forwardRef(InputBase);

export { Input };