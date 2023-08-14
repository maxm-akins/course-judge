import { useState } from "react";
import axios from "./axios";



export const postReview = async (data) => {


    try {
        const response = await axios.post(
            `/reviews`,
            JSON.stringify(data),
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return await response;

    } catch (err) {
        console.log(err)
        return err;

    }

};


export const getReviews = async (course) => {

    try {
        const response = await axios.get(
            `/reviews/${course}`,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        await console.log(response.data)
        return await response.data;

    } catch (err) {
        console.log(err)
        return err;

    }

};