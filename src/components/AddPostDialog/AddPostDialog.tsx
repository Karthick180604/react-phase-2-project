import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Stack,
} from "@mui/material";
import { getAllPostTagsArray } from "../../services/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";
import { addUploadedPostAction } from "../../redux/Actions/userActions";

interface AddPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; body: string; tags: string[] }) => void;
}

const AddPostDialog: React.FC<AddPostDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (open) {
      getAllPostTagsArray()
        .then((res) => setAvailableTags(res.data))
        .catch((error) => console.error("Failed to fetch tags", error));
    }
  }, [open]);

  const handleSubmit = () => {
    if (title.trim() && body.trim()) {
      const postObj = {
        id: 252 + userDetails.uploadedPosts.length,
        title: title,
        body: body,
        tags: selectedTags,
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        views: 0,
        userId: userDetails.id,
      };
      dispatch(addUploadedPostAction(postObj));
      onSave({ title, body, tags: selectedTags });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    setSelectedTags([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            color="tertiary"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            color="tertiary"
            label="Body"
            fullWidth
            multiline
            minRows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Autocomplete
            multiple
            options={availableTags}
            value={selectedTags}
            onChange={(event, value) => setSelectedTags(value)}
            renderInput={(params) => (
              <TextField
                color="tertiary"
                {...params}
                label="Select Tags"
                placeholder="Tags"
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button color="tertiary" onClick={handleSubmit} variant="contained">
          Add Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostDialog;
