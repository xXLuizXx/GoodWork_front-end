import {
  Alert, AlertIcon, Box, FormControl, FormErrorMessage, FormLabel,
  Input, Link, Radio, RadioGroup, Stack, Text
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type CurriculumSource = "profile" | "upload";

export interface JobApplicationForm {
  curriculum_user: FileList;
  curriculum_source: CurriculumSource;
}

interface ApplicationCurriculumFieldProps {
  profileCurriculum?: string;
  source: CurriculumSource;
  onSourceChange: (source: CurriculumSource) => void;
  register: UseFormRegister<JobApplicationForm>;
  errors: FieldErrors<JobApplicationForm>;
  selectedFile?: File;
}

// Campo de currículo do modal de candidatura: usa o currículo do perfil ou um PDF enviado na hora
export function ApplicationCurriculumField({
  profileCurriculum, source, onSourceChange, register, errors, selectedFile
}: ApplicationCurriculumFieldProps) {
  const isUploading = source === "upload";

  return (
    <>
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">
          {profileCurriculum
            ? "Você pode usar o currículo do seu perfil ou enviar outro PDF só para esta vaga."
            : "Para concorrer a esta vaga, envie seu currículo em formato PDF."}
        </Text>
      </Alert>

      {profileCurriculum && (
        <RadioGroup value={source} onChange={(value) => onSourceChange(value as CurriculumSource)}>
          <Stack spacing="2">
            <Radio value="profile">
              <Text fontSize="sm">
                Usar o currículo do meu perfil{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/curriculum_user_profile/${profileCurriculum}`}
                  isExternal
                  color="blue.500"
                  onClick={(e) => e.stopPropagation()}
                >
                  (visualizar)
                </Link>
              </Text>
            </Radio>
            <Radio value="upload">
              <Text fontSize="sm">Enviar outro arquivo</Text>
            </Radio>
          </Stack>
        </RadioGroup>
      )}

      {isUploading && (
        <FormControl isInvalid={!!errors.curriculum_user} isRequired>
          <FormLabel fontSize="sm" fontWeight="bold">
            Currículo (PDF)
          </FormLabel>
          <Input
            type="file"
            accept=".pdf"
            {...register("curriculum_user", {
              required: "O currículo é obrigatório",
              validate: {
                isPDF: (files) => {
                  if (files && files[0]) {
                    return files[0].type === 'application/pdf' ||
                           files[0].name.toLowerCase().endsWith('.pdf') ||
                           "Apenas arquivos PDF são aceitos";
                  }
                  return true;
                },
                fileSize: (files) => {
                  if (files && files[0]) {
                    return files[0].size <= 5 * 1024 * 1024 ||
                           "O arquivo deve ter no máximo 5MB";
                  }
                  return true;
                }
              }
            })}
            p="1"
          />
          <FormErrorMessage>
            {errors.curriculum_user?.message}
          </FormErrorMessage>
          <Text fontSize="xs" color="gray.600" mt="2">
            Tamanho máximo: 5MB • Formato aceito: PDF
          </Text>
        </FormControl>
      )}

      {isUploading && selectedFile && (
        <Alert status="success" borderRadius="md" size="sm">
          <AlertIcon />
          <Box>
            <Text fontSize="sm" fontWeight="medium">
              Arquivo selecionado:
            </Text>
            <Text fontSize="xs">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
          </Box>
        </Alert>
      )}
    </>
  );
}
