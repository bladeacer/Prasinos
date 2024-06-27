import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";

function EditReward() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get current user from context

  const [imageFile, setImageFile] = useState(null);
  const { id } = useParams();
  const [reward, setReward] = useState({
    name: "",
    description: "",
    points_needed: "",
    tier_required: "",
    userId: "", // Ensure userId is included in reward state
  });

  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false); // State to track if user can edit

  useEffect(() => {
    http.get(`/reward/${id}`).then((res) => {
      setReward(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
      if (res.data.userId === user.id) {
        // Check if the logged-in user is the creator
        setEditable(true);
      }
    });
  }, [id, user.id]);

  const formik = useFormik({
    initialValues: {
      name: reward.name,
      description: reward.description,
      points_needed: reward.points_needed,
      tier_required: reward.tier_required,
    },
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
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.name = data.name.trim();
      data.description = data.description.trim();
      http.put(`/reward/${id}`, data).then((res) => {
        console.log(res.data);
        toast.success("Reward updated successfully.");
        navigate("/rewards");
      });
    },
  });

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
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
  };

  const deleteReward = () => {
    http.delete(`/reward/${id}`).then((res) => {
      console.log(res.data);
      toast.success("Reward deleted successfully.");
      navigate("/rewards");
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" component={Link} to="/rewards">
          Go Back
        </Button>
      </Box>
      <Typography variant="h4" sx={{ my: 2 }}>
        Edit Reward
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Name *"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={!editable} // Disable field if not editable
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              multiline
              minRows={2}
              label="Description *"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              disabled={!editable} // Disable field if not editable
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Points Needed *"
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
              disabled={!editable} // Disable field if not editable
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
              disabled={!editable} // Disable field if not editable
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
              <Button
                variant="contained"
                component="label"
                disabled={!editable} // Disable button if not editable
              >
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={onFileChange}
                />
              </Button>
              {imageFile ? (
                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                  <img
                    alt="reward"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => setImageFile(null)}
                    disabled={!editable} // Disable button if not editable
                  >
                    Remove Image
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    mt: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100px",
                  }}
                >
                  <Typography>No Image</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {editable && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 2 }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
      <Dialog
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this reward? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteReward} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditReward;
