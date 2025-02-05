import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

interface ITextareaProps extends ChakraTextareaProps {
  name: string;
  placeholder: string;
  label?: string;
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<HTMLTextAreaElement, ITextareaProps> = (
  { name, placeholder, label, error = null, ...rest },
  ref
): JSX.Element => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel htmlFor={name} id={`label-for-${name}`}>
          {label}
        </FormLabel>
      )}

      <InputGroup>
        <InputLeftElement pointerEvents="none" fontSize="medium" />
        <ChakraTextarea
          name={name}
          id={name}
          placeholder={placeholder}
          boxShadow="2xl"
          borderRadius="md"
          focusBorderColor="blue.400"
          bgColor="gray.100"
          variant="filled"
          _hover={{ bgColor: "gray.200" }}
          size="lg"
          ref={ref}
          {...rest}
        />
      </InputGroup>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const Textarea = forwardRef(TextareaBase);

export { Textarea };
