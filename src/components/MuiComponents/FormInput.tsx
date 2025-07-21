import { TextField, type TextFieldProps } from "@mui/material";

type FormInputProps = TextFieldProps;

const FormInput = (props: FormInputProps) => {
  return (
    <TextField
      variant="standard"
      fullWidth
      {...props}
    />
  );
};

export default FormInput;
