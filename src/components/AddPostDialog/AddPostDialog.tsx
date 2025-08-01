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
import ApiError from "../ApiError/ApiError";
import { setApiError } from "../../redux/Actions/errorAction";

interface AddPostDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddPostDialog: React.FC<AddPostDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const userDetails = useSelector((state: RootState) => state.user);

  const hasApiError=useSelector((state:RootState)=>state.error.hasApiError)

  useEffect(() => {
    if (open) {
      getAllPostTagsArray()
        .then((res) => setAvailableTags(res.data))
        .catch((error) => {
          console.error("Failed to fetch tags", error)
          dispatch(setApiError(true))
        });
    }
  }, [open]);

  const handleSubmit = () => {
    if (title.trim() && body.trim()) {
      const postObj = {
        id: 252 + userDetails.uploadedPosts.length,
        title,
        body,
        tags: selectedTags,
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        userId: userDetails.id,
      };
      dispatch(addUploadedPostAction(postObj));
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    setSelectedTags([]);
    onClose();
  };

  if(hasApiError)
  {
    return <ApiError />
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-testid="add-post-dialog"
    >
      <DialogTitle>Add New Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            color="tertiary"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="add-post-title"
          />
          <TextField
            color="tertiary"
            label="Body"
            fullWidth
            multiline
            minRows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            data-testid="add-post-body"
          />
          <Autocomplete
            multiple
            options={availableTags}
            value={selectedTags}
            onChange={(event, value) => setSelectedTags(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Tags"
                placeholder="Tags"
                color="tertiary"
                data-testid="add-post-tags"
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
          data-testid="add-post-cancel"
        >
          Cancel
        </Button>
        <Button
          color="tertiary"
          onClick={handleSubmit}
          variant="contained"
          data-testid="add-post-submit"
        >
          Add Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostDialog;
