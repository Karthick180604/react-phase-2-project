import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUserProfileDetails } from "../../redux/Actions/userActions";

interface Company {
  name: string;
  title: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    firstName: string;
    lastName: string;
    image: string;
    phone: string;
    gender: string;
    company: Company;
  }) => void;
  initialData: {
    firstName: string;
    lastName: string;
    image: string;
    phone: string;
    gender: string;
    company: Company;
  };
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "companyName" || name === "companyTitle") {
      setFormData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [name === "companyName" ? "name" : "title"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.image.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.gender.trim() !== "" &&
      formData.company.name.trim() !== "" &&
      formData.company.title.trim() !== ""
    );
  }, [formData]);

  const handleSubmit = () => {
    dispatch(
      setUserProfileDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        image: formData.image,
        phone: formData.phone,
        gender: formData.gender,
        company: {
          name: formData.company.name,
          title: formData.company.title,
        },
      }),
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      data-testid="edit-profile-dialog"
    >
      <DialogTitle data-testid="dialog-title">Edit Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="firstName"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              inputProps={{ "data-testid": "firstName-input" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="lastName"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              inputProps={{ "data-testid": "lastName-input" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="image"
              color="tertiary"
              label="Profile Image URL"
              fullWidth
              value={formData.image}
              onChange={handleChange}
              inputProps={{ "data-testid": "image-input" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="phone"
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              inputProps={{ "data-testid": "phone-input" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="gender"
              label="Gender"
              fullWidth
              value={formData.gender}
              onChange={handleChange}
              inputProps={{ "data-testid": "gender-input" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="companyName"
              label="Company Name"
              fullWidth
              value={formData.company.name}
              onChange={handleChange}
              inputProps={{ "data-testid": "companyName-input" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              color="tertiary"
              name="companyTitle"
              label="Job Title"
              fullWidth
              value={formData.company.title}
              onChange={handleChange}
              inputProps={{ "data-testid": "companyTitle-input" }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" data-testid="cancel-button">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          color="tertiary"
          data-testid="save-button"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
