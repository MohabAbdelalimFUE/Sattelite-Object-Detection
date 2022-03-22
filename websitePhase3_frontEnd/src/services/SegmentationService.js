import API from "./APIs";
import { makeRequest } from "../util";

export async function segmentation(seg_model) {
    console.log(seg_model)
    const res = await makeRequest(`${API.SEGMENTATION_API_URL}`, {
        method: "POST",
        body: JSON.stringify(seg_model),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
    });
    return Buffer.from(res.data.data, 'binary').toString('base64');
}
export async function upload_Segmentation(seg_model) {
    console.log(seg_model)
    const res = await makeRequest(`${API.UPLOAD_SEGMENTATION_API_URL}`, {
        method: "POST",
        body: JSON.stringify(seg_model),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
    });
    // console.log(res,"789543135468")
    return res
    // return Buffer.from(res.data.data, 'binary').toString('base64');
}

export async function Upload(formData) {
    console.log(formData)
    const res = await makeRequest(`${API.uploadtifFile}`, {
        method: "POST",
        body: formData,
        headers: {
            "Access-Control-Allow-Origin": "*"

        },
    });
    return res;
}