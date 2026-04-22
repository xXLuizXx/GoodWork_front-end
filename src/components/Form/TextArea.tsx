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
  useColorModeValue,
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
        <InputLeftElement pointerEvents="none" fontSize="medium" />
        <ChakraTextarea
          name={name}
          id={name}
          placeholder={placeholder}
          boxShadow="2xl"
          borderRadius="md"
          focusBorderColor="blue.400"
          bgColor={inputBg}
          variant="filled"
          _hover={{ bgColor: inputHover }}
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
