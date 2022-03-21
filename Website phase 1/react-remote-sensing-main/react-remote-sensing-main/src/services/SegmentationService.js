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
