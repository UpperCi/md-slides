import React from 'react';
import { useNavigate } from "react-router-dom";
import { Presentation } from "./Presentation";

export function SlidePreview({json}) {
    let presentation = Presentation(json.content);
    const navigate = useNavigate();

    const directDetail = () => {
        navigate(`detail/${json._id}`)
    }

    return <div className="slide-preview" onClick={directDetail} >
        <h1>{json.title}</h1>
        <p>{json.content}</p>
        {/* <Slide slide={presentation.slides[0]}></Slide> */}
    </div>;
}
