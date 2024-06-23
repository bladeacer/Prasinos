import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddReward() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      points_needed: "",
      tier_required: "",
    },
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
        .number()
        .positive("Tier required must be a positive number")
        .max(3, "Highest tier is 3")
        .required("Tier required is required"),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.name = data.name.trim();
      data.description = data.description.trim();
      http.post("/reward", data).then((res) => {
        console.log(res.data);
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

  return (
    <Box>
      <Box sx = {{ my: 2 }}>
        <Button variant="contained" component={Link} to="/rewards">
        Go Back
      </Button>
      </Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Reward
      </Typography>
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
                formik.touched.description && Boolean(formik.errors.description)
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
            Add
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default AddReward;
