import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../http";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditReward() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const { id } = useParams();
  const [reward, setReward] = useState({
    name: "",
    description: "",
    points_needed: "",
    tier_required: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/reward/${id}`).then((res) => {
      console.log(res.data);
      setImageFile(res.data.imageFile);
      setReward(res.data);
      setLoading(false);
    });
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
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
      points_needed: yup
        .number()
        .positive("Points needed must be a positive number")
        .required("Points needed is required"),
      tier_required: yup
        .number()
        .positive("Tier required must be a positive number")
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
        navigate("/rewards");
      });
    },
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteReward = () => {
    http.delete(`/reward/${id}`).then((res) => {
      console.log(res.data);
      navigate("/rewards");
    });
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
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

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
                autoComplete="off"
                label="Tier Required"
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
              />
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
                    ></img>
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
        <DialogTitle>Delete Tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tutorial?
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
