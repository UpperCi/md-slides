import React from "react";

export function Slide(slide) {
    slide = slide.slide;
    if (!slide.inner) return null;
    let slideContent;
    for (let b of slide.inner) {
        let contentBlock = <content-block> {b} </content-block>;
        slideContent += contentBlock
    }
    return slideContent;
}
