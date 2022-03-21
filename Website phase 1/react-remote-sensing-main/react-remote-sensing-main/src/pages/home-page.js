import React, { useEffect, useState, useParams } from "react";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useLocation } from 'react-router-dom'

import { segmentation } from '../services'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export const HomePage = (props) => {
    let bbox = localStorage.getItem('Bbox')
    const [aiModel, setAiModel] = useState('');
    const [postProcessing, setPostProssesing] = useState('')
    const handleChangeAiModel = (event) => {
        setAiModel(event.target.value);
    };
    const handleChangePostProcessing = (event) => {
        setPostProssesing(event.target.value);
    };
    const handleClearSelection = (event) => {
        setPostProssesing('');
        setAiModel('');
    };
    const onSegmentation = async () => {
        const segModel = {
            "Bbox": bbox,
            "Width": 400,
            "Height": 400,
            "Algorithm": aiModel,
            "PostProcessing": postProcessing
        }
        console.log("MODEL", segModel)
        const segmentationResponse = await segmentation(segModel);
    }
    return (
        <Grid container spacing={8} padding={10}>
            <Grid item xs={6} md={3}>
                <Item style={{ marginBottom: 10 }}>1. Data Source</Item>
                <Link to='/add-area'>
                    <Button variant="outlined"
                        startIcon={<AddCircleIcon />} >
                        Add Area
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={6} md={3}>
                <Item>2. AI Model</Item>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={aiModel}
                    onChange={handleChangeAiModel}
                    style={{ marginTop: 8 }}
                >
                    <FormControlLabel value="SVM" control={<Radio />} label="Support Vector Machine" />
                    <FormControlLabel value="RF" control={<Radio />} label="Random Forest" />
                    <FormControlLabel value="DT" control={<Radio />} label="Decision Tree" />
                    <FormControlLabel value="CNN" control={<Radio />} label="CNN" />

                </RadioGroup>
            </Grid>
            <Grid item xs={6} md={3}>
                <Item>3. Post-processing</Item>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={postProcessing}
                    onChange={handleChangePostProcessing}
                    style={{ marginTop: 8 }}
                >
                    <FormControlLabel value="Download" control={<Radio />} label="Download Mask" />
                    <FormControlLabel value="ShowOnMap" control={<Radio />} label="Show on map" />

                </RadioGroup>
            </Grid>
            <Grid item xs={6} md={3}>
                <Item style={{ marginBottom: 10 }}>4. Run Project</Item>
                <Link to='/map-overlay'>
                    <Button variant="outlined">
                        Mask overlay
                    </Button>
                </Link>
                {aiModel != '' && postProcessing != '' && !!bbox ?
                    <Button variant="outlined"
                        onClick={onSegmentation}>
                        Run processing
                    </Button>
                    : null}
                <Button variant="outlined"
                    startIcon={<RemoveCircleOutlineIcon />}
                    onClick={handleClearSelection}>
                    Clear selection
                </Button>
            </Grid>
        </Grid >
    );
};