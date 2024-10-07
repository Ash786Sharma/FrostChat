"use client";

import { useState, useEffect } from "react";
import { Box, IconButton, TextField, Chip, Typography, Grid2, Divider, Alert, AlertTitle, Skeleton } from "@mui/material";
import { Male, Female, Transgender, Close, Add, PlayArrow, Replay } from "@mui/icons-material";
import axios from "axios"; // To make API requests


const LoginForm = ({bgColor, onSuccess}) => {
  const [userId, setUserId] = useState(null); // Track user ID
  const [loading, setLoading] = useState(true); // Track loading state
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");
  const [preferenceText, setPreferenceText] = useState("");
  const [badges, setBadges] = useState([]);
  const [alert, setAlert] = useState(false)
  const [alertmsg, setAlertMsg] = useState("")
  const [error, setError] = useState(false)
  const [submiterror, setSubmitError] = useState(false)
  const [gradient, setGradient] = useState(""); // State for gradient
  const MAX_BADGES = 20; // Limit the number of badges

  // Fetch unique user ID from the server on page load
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/api/get-user-id"); // Replace with your actual API endpoint
        setUserId(response.data.userId); // Set the user ID from server response
      } catch (error) {
        setError(true)
        setAlertMsg("Server Side Error, Please Check Internet.")
        console.error("Error fetching user ID:", error);
      } finally {
        if (userId){
          setLoading(false); // Stop loading once user ID is fetched
        } else {setLoading(false)}
        
      }
    };
    fetchUserId();
  }, []);

  // Update gradient based on gender and preference
  useEffect(() => {
    let newGradient = "";

    if (gender && preference) {
      if (gender === "male") {
        switch (preference) {
          case "male":
            newGradient = "radial-gradient(circle, #78bffa 30%, #ffffff 100%)";
            break;
          case "female":
            newGradient = "radial-gradient(circle, #78bffa 30%, #f779f7 100%)";
            break;
          case "other":
            newGradient = "radial-gradient(circle, #78bffa 30%, #fdff7a 100%)";
            break;
        }
      } else if (gender === "female") {
        switch (preference) {
          case "male":
            newGradient = "radial-gradient(circle, #f779f7 30%, #78bffa 100%)";
            break;
          case "female":
            newGradient = "radial-gradient(circle, #f779f7 30%, #ffffff 100%)";
            break;
          case "other":
            newGradient = "radial-gradient(circle, #f779f7 30%, #fdff7a 100%)";
            break;
        }
      }
    } else if (gender) {
      newGradient = gender === "male"
        ? "radial-gradient(circle, #78bffa 50%, #ffffff 100%)"
        : gender === "female"
        ? "radial-gradient(circle, #f779f7 50%, #ffffff 100%)"
        : "radial-gradient(circle, #ffa500 30%, #ffffff 100%)";
    } else {
      newGradient = "#202020";
    }

    setGradient(newGradient);
    bgColor(newGradient); // Send gradient to parent
  }, [gender, preference, bgColor]);
  
  // Handle user gender selection
  const handleGenderSelection = (gender) => {
    setGender(gender);
  };

  // Handle user gender preference selection
  const handlePreferenceSelection = (preference) => {
    setPreference(preference);
  };

  // Handle adding preference text to badges
  const handleAddBadge = () => {
    if (preferenceText && badges.length < MAX_BADGES) { // Check if badge limit is reached
      setBadges([...badges, preferenceText]);
      setPreferenceText(""); // Reset text input
    } else (setAlert(true), setAlertMsg("Maximum number of badges! Reached"))
  };

  // Handle removing a badge
  const handleRemoveBadge = (badgeToRemove) => {
    setBadges(badges.filter((badge) => badge !== badgeToRemove));
  };

  // Handle Enter key press to add badge
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddBadge();
    }
  };

  // Automatically hide alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer); // Cleanup timer
    }
    if (submiterror) {
      const timer = setTimeout(() => {
        setSubmitError(false);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [alert, submiterror]);

  // Handle form submission
  const handleSubmit = async () => {
    const data = {
      userId,
      gender,
      preference,
      badges,
    };

    try {
      await axios.post("/api/save-preferences", data); // Replace with your actual API endpoint
      console.log("Data submitted successfully");
      if (!gender || !preference || badges.length === 0)
        {onSuccess(true)
          console.log("success");  
        }
      else {setAlertMsg("Please Select required options.")
            setAlert(true)}
    } catch (error) {
      console.error("Error submitting data:", error);
      if (!gender || !preference || badges.length === 0) {
        setAlertMsg("Please Select required options.") 
        setAlert(true)
      } else {
        onSuccess(true)
        setAlertMsg("Error submitting data.")
        setSubmitError(true)
      }
      
    }
  };

  return (
    <>{loading ? (error ? (<><Alert severity="error" sx={{mt: 25, }} action={<IconButton >
      <Replay/>
    </IconButton>}>
    <AlertTitle>Error!</AlertTitle>
    {alertmsg}
  </Alert>
  </>):(<><Grid2 container spacing={8} alignItems="center" justifyContent="center" sx={{pb: 1}}>
      <Grid2 item="true" xs={12} >
        <Skeleton variant="text" width={150} height={30}/>
      </Grid2>
      <Grid2 item="true">
        <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
      <Grid2 item="true">
      <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
    </Grid2>
    <Divider variant="middle" />
    <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{p: 1}}>
      <Grid2 item="true" xs={12} >
        <Skeleton variant="text" width={150} height={30}/>
      </Grid2>
      <Grid2 item="true">
        <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
      <Grid2 item="true">
      <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
      <Grid2 item="true">
      <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
    </Grid2>
    <Divider variant="middle" />
    <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{p: 1}}>
      <Grid2 item="true" xs={10} >
        <Skeleton variant="rectangular" width={400} height={80}/>
      </Grid2>
      <Grid2 item="true">
        <Skeleton variant="circular" width={80} height={80}/>
      </Grid2>
    </Grid2>
    <Divider variant="middle" />
    <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{p: 1}}>
      <Grid2 item="true">
        <Skeleton variant="rectangular" width={500} height={150}/>
      </Grid2>
    </Grid2>
    </>
  
      ) ):(<>
      {/* Gender Selection */}
      <Grid2 container spacing={8} alignItems="center" justifyContent="center" sx={{p: 1}}>
        <Grid2 item="true" xs={12} >
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            I am :
          </Typography>
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={gender === "male" ? "primary" : "default"}
            onClick={() => handleGenderSelection("male")}
          >
            <Male sx={{ fontSize: 60 }} />
          </IconButton>
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={gender === "female" ? "secondary" : "default"}
            onClick={() => handleGenderSelection("female")}
          >
            <Female sx={{ fontSize: 60 }} />
          </IconButton>
        </Grid2>
      </Grid2>
      <Divider variant="middle" />
      {/* Gender Preference Selection */}
      <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{p: 1}}>
        <Grid2 item="true" xs={12}>
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            Intrested in :
          </Typography>
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={preference === "male" ? "primary" : "default"}
            onClick={() => handlePreferenceSelection("male")}
          >
            <Male sx={{ fontSize: 60 }} />
          </IconButton>
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={preference === "female" ? "secondary" : "default"}
            onClick={() => handlePreferenceSelection("female")}
          >
            <Female sx={{ fontSize: 60 }} />
          </IconButton>
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={preference === "other" ? "warning" : "default"}
            onClick={() => handlePreferenceSelection("other")}
          >
            <Transgender sx={{ fontSize: 60 }} />
          </IconButton>
        </Grid2>
      </Grid2>
      <Divider variant="middle" />
      {/* Text Input for Preference */}
      <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{ p: 1 }}>
        <Grid2 item="true" size={10} >
          <TextField fullWidth
            label="Enter your preference"
            value={preferenceText}
            onChange={(e) => setPreferenceText(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="filled"
          />
        </Grid2>
        <Grid2 item="true">
          <IconButton
            color={"primary"}
            onClick={handleAddBadge}
          >
            <Add sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid2>
      </Grid2>
      <Divider variant="middle" />
      {/* Display Badges */}
      <Box sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          marginTop: 2,
          maxHeight: 130, // Adjust height as needed
          overflowY: "auto", // Enable scrolling
          padding: 1,
          borderRadius: "4px",
        }}>
        {badges.map((badge, index) => (
          <Chip
            key={index}
            label={badge}
            onDelete={() => handleRemoveBadge(badge)}
            deleteIcon={<Close />}
          />
        ))}
      </Box>
      <Grid2 container justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
  <Grid2 item="true" xs={8}>
    {/* Display Alert */}
    {alert && (
      <Alert severity="info" onClose={() => setAlert(false)}>
        {alertmsg}
      </Alert>
    )}
    {submiterror && (
      <Alert severity="error" onClose={() => setSubmitError(false)}>
        {alertmsg}
      </Alert>
    )}
  </Grid2>
  <Grid2 item="true" xs="auto">
    <IconButton
            color={"black"}
            onClick={handleSubmit}
          >
            <PlayArrow sx={{ fontSize: 50 }} />
          </IconButton>
  </Grid2>
</Grid2>
    </>) }
    </>
  );
};

export default LoginForm;
