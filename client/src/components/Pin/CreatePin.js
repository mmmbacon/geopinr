import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Box, FormControl, FormHelperText, FormLabel, Input, InputLabel } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from '../../client';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const CreatePin = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  const client = useClient();
  const {state, dispatch} = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () =>{
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT"})
  }

  const handleSubmit = async event => {
    try{
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude }
      await client.request(CREATE_PIN_MUTATION, variables);
      handleDeleteDraft();
    }catch(err){
      setSubmitting(false);
      console.error("Error creating pin", err);
    }
  }

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopinr");
    data.append("cloud_name", "mmmbacon");
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/mmmbacon/image/upload',
      data,
    );
    return res.data.url;
  }
 
  return (
    <form className={classes.form}>
      <Typography 
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
        >
          <LandscapeIcon className={classes.iconLarge}></LandscapeIcon>
        Skate Spot
      </Typography>
      <Box p={1}>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
        </FormControl>
        <TextField
          name="title"
          label="title"
          placeholder="Insert pin title"
          onChange={ e => setTitle(e.target.value)}>    
        </TextField>
        <input
          accept="image"
          id="image"
          type="file"
          className="classes.input"
          onChange={ e => setImage(e.target.files[0])}>  
        </input>
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image && "green"}}
          >
            <AddAPhotoIcon></AddAPhotoIcon>
          </Button>
        </label>
      </Box>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={ e => setContent(e.target.value)}
        ></TextField>
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon}></ClearIcon>
          Discard
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting }
          onClick={handleSubmit}
        >
          <SaveIcon className={classes.rightIcon}></SaveIcon>
          Submit
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
