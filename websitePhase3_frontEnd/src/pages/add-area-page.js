import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { DrawMapComponent } from "../components/draw-map-component"
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const AddAreaPage = () => {
    const [bbox, setbbox] = useState();
    useEffect(() => {
        localStorage.setItem("selectedType", "addArea")
    }, [])
    const handleBbox = (event) => {
        console.log("handlebbox", event)
        setbbox(event);
        console.log(typeof (event), "testttt")
        localStorage.setItem("Bbox", JSON.stringify(event));
        console.log(localStorage.getItem('Bbox'))
    };
    return (
        <Container>
            <Link to='/' state={{ Bbbox: bbox }}>
                <Button variant="outlined">
                    Save
                </Button>
            </Link>
            <DrawMapComponent
                handleBbox={handleBbox}
            />

        </Container>
    )
} 
