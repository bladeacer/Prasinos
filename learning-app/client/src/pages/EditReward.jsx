import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditReward() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [reward, setReward] = useState({
    name: "",
    description: "",
    points_needed: "",
    tier_required: "", // Change to string for dropdown value
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get(`/reward/${id}`);
        setImageFile(response.data.imageFile);
        setReward(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reward:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: reward,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must be at most 100 characters")
        .required("Name is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(200, "Description must be at most 200 characters")
        .required("Description is required"),
      points_needed: yup
        .number()
        .positive("Points needed must be a positive number")
        .required("Points needed is required"),
      tier_required: yup
        .string()
        .oneOf(["Bronze", "Silver", "Gold"], "Invalid tier")
        .required("Tier required is required"),
    }),
    onSubmit: async (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.name = data.name.trim();
      data.description = data.description.trim();

      try {
        await http.put(`/reward/${id}`, data);
        navigate("/rewards");
      } catch (error) {
        console.error("Error updating reward:", error);
      }
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteReward = async () => {
    try {
      await http.delete(`/reward/${id}`);
      navigate("/rewards");
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          toast.error("Failed to upload file.");
        });
    }
  };

  const removeImage = () => {
    setImageFile(null);
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Error 404: Reward not found
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          Either the Reward ID is deleted or invalid.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/rewards")}>
          Go Back to Rewards
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Reward
      </Typography>
      {!loading && (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                multiline
                minRows={2}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Points Needed"
                name="points_needed"
                value={formik.values.points_needed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.points_needed &&
                  Boolean(formik.errors.points_needed)
                }
                helperText={
                  formik.touched.points_needed && formik.errors.points_needed
                }
              />
              <TextField
                fullWidth
                margin="dense"
                select
                label="Tier Required *"
                name="tier_required"
                value={formik.values.tier_required}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tier_required &&
                  Boolean(formik.errors.tier_required)
                }
                helperText={
                  formik.touched.tier_required && formik.errors.tier_required
                }
              >
                {["Bronze", "Silver", "Gold"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={onFileChange}
                  />
                </Button>
                {imageFile && (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="reward"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    />
                  </Box>
                )}
                {imageFile && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={removeImage}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Reward</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reward?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteReward}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditReward;
