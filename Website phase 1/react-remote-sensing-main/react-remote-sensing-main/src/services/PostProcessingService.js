import API from "./APIs";
import axios from "axios";
import { Buffer } from 'buffer';

export async function fetchSegmentationMask() {
    let URL = `${API.SEGMENTATION_API_URL}`;
    console.log(URL)
    return await axios({
        method: "get",
        url: URL,
        config: {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-Type": "image/jpeg",
            },
        },
    }).catch(function (err) {
        return err;
    })
}

// .then(response => Buffer.from(response.data, 'binary').toString('base64'));