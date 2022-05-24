import { SlidePreview } from "./SlidePreview.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Overview() {
    const [presentations, setPresentations] = useState([]);
    const [page, setPage] = useState(0);

    const previewPresentations = presentations.map((presentation) => (
        <SlidePreview json={presentation} />
    ));

    const loadJSON = (data) => {
        setPresentations(data.items);
    }

    const fetchJson = () => {
        const options = {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }
        let url = `http://localhost:8001/api/?start=${page + 1}&limit=9`;

        fetch(url, options)
            .then(response => response.json())
            .then(data => loadJSON(data))
            .catch(err => console.error(err));
    }

    useEffect(fetchJson, [page]);

    return (
        <div className="root">
            <div id="title">Welkom!</div>
            <div className="preview-container">{previewPresentations}</div>
            <div className="taskbar">
                <button style={{width:"40%"}} onClick={() => {setPage(Math.max(page - 1, 0))}}>Vorige pagina</button>
                <Link style={{width:"20%"}} className="add" to="/create">Voeg toe</Link>
                <button style={{width:"40%"}} onClick={() => {setPage(page + 1)}}>Volgende pagina</button>
            </div>
            <br></br>
        </div>
    );
}
