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
import ReactTooltip from "react-tooltip";
import { MdInfo } from "@react-icons/all-files/md/MdInfo"
import { segmentation, Upload, upload_Segmentation, fetchSegmentationBoundingMask } from '../services'

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
    const [selectedFile, setSelectedFile] = useState(null)
    // const [selectedType, setSelectedType] = useState(0)
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
        const newHeight = localStorage.getItem("height")
        console.log(newHeight, "newHeight")
        const segUploadModel = {
            "Bbox": bbox,
            "Width": 400,
            "Height": 400,
            "Algorithm": aiModel,
            "PostProcessing": postProcessing
        }
        const segModel = {
            "Bbox": bbox,
            "Width": parseInt(newHeight),
            "Height": 400,
            "Algorithm": aiModel,
            "PostProcessing": postProcessing
        }
        console.log("MODEL", segModel)
        const selectedType = await localStorage.getItem("selectedType")
        if (selectedType == "addArea") {
            const segmentationResponse = await segmentation(segUploadModel);
            console.log(segmentationResponse, "segmentationResponse")

        }
        else if (selectedType == "upload") {
            const uploadSegmentationResponse = await upload_Segmentation(segUploadModel);
            console.log(uploadSegmentationResponse, "uploadSegmentationResponse")
            // const boundingBox = await fetchSegmentationBoundingMask();
        }
        else {
            console.log("Please select Data source")
        }
    }
    const onUploadFile = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0])
        console.log(selectedFile);
    }
    const onFileUpload = async () => {
        localStorage.setItem("selectedType", "upload")
        // setSelectedType(2)
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "file",
            selectedFile,
            selectedFile.name
        );

        console.log(selectedFile);
        console.log(formData)

        const uploadedFile = await Upload(formData)
        var x = JSON.stringify(uploadedFile[1]["bbox"]);
        console.log("[" + (x.replaceAll('[', "").replaceAll(']', "").replaceAll('\"', "")) + "]")
        var boundings = "[" + (x.replaceAll('[', "").replaceAll(']', "").replaceAll('\"', "")) + "]";
        console.log(localStorage.getItem("Bbox"), "Bboxx")
        // console.log(JSON.stringify(uploadedFile[1]["bbox"]),"uploadedFileResponse")
        localStorage.setItem("Bbox", boundings)
    };
    return (
        <Grid container spacing={8} padding={10}>
            <Grid item xs={6} md={3} sx={{ flex: 1, flexDirection: "column", display: "flex" }}>
                <Item style={{ marginBottom: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>1. Data Source</p>
                    <MdInfo style={{ padding: 5 }} size={20} data-tip data-for="DataSource" />
                </Item>
                {/* <MdInfo data-tip data-for="DataSource" /> */}
                <ReactTooltip id="DataSource" place="top" effect="solid">Choose One Option for choosing Data Source</ReactTooltip>
                <Link to='/add-area'>
                    <Button variant="outlined"
                        startIcon={<AddCircleIcon />} >
                        Add Area
                    </Button>
                </Link>
                <div>
                    <input style={{ marginTop: 10 }} accept="image/*" id="contained-button-file" type="file" onChange={onUploadFile} />
                    <Button onClick={onFileUpload}>
                        Upload
                    </Button>
                </div>
                <div>
                    <p style={{ marginBottom: -5 }}> To download more TIF files</p>
                    <div style={{ display: "flex", flexDirection: "row", alignContent: "center" }}>
                        <a href="https://earthexplorer.usgs.gov/" target="_blank">Click here</a>
                        <MdInfo style={{ padding: 5 }} size={20} data-tip data-for="TIFFiles" />
                        <ReactTooltip id="TIFFiles" place="top" effect="solid">Redirect to usgs.com</ReactTooltip>
                    </div>
                </div>
            </Grid>
            <Grid item xs={6} md={3}>
                <Item style={{ marginBottom: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>2. AI Model</p>
                    <MdInfo style={{ padding: 5 }} size={20} data-tip data-for="AIModel" />
                </Item>
                {/* <Item  > <MdInfo style={{ marginBottom: -5 }} size={20} data-tip data-for="AIModel" /></Item> */}
                <ReactTooltip id="AIModel" place="top" effect="solid">Choose One AI model for classification</ReactTooltip>
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
                <Item style={{ marginBottom: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>3. Post-processing</p>
                    <MdInfo style={{ padding: 5 }} size={20} data-tip data-for="PostProcessing" />
                </Item>
                {/* <Item  > <MdInfo style={{ marginBottom: -5 }} size={20} data-tip data-for="PostProcessing" /></Item> */}
                <ReactTooltip id="PostProcessing" place="top" effect="solid">Choose "Download thematic layer" for downloading the thematic layer or "Show on Map" for viewing the classified image on the map</ReactTooltip>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={postProcessing}
                    onChange={handleChangePostProcessing}
                    style={{ marginTop: 8 }}
                >
                    <FormControlLabel value="Download" control={<Radio />} label="Download Thematic layer" />
                    <FormControlLabel value="ShowOnMap" control={<Radio />} label="Show on map" />

                </RadioGroup>
            </Grid>
            <Grid item xs={6} md={3}>
                <Item style={{ marginBottom: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <p>4. Run Project</p>
                    <MdInfo style={{ padding: 5 }} size={20} data-tip data-for="RunProject" />
                </Item>
                {/* <Item style={{ marginBottom: 10 }}> <MdInfo style={{ marginBottom: -5 }} size={20} data-tip data-for="RunProject" /></Item> */}
                <ReactTooltip id="RunProject" place="top" effect="solid">Choose "Run Processing" to run your model or "Thematic Overlay" for viewing the map</ReactTooltip>
                <Link to='/map-overlay'>
                    <Button variant="outlined">
                        Thematic overlay
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