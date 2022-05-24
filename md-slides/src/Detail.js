import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Detail() {
    const [presentation, setPresentation] = useState({});
    let presentationId = useParams().presentationId;
    const navigate = useNavigate();

    const directEdit = () => {
        navigate(`/edit/${presentationId}`)
    }
    
    const deletePresentation = () => {
        const options = {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        }
        let url = `http://localhost:8001/api/${presentationId}`;

        fetch(url, options)
            .then(() => navigate("/"))
            .catch(err => console.error(err));
    }

    const loadJSON = (data) => {
        setPresentation(data);
    }

    const fetchJson = () => {
        const options = {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }
        let url = `http://localhost:8001/api/${presentationId}`;

        fetch(url, options)
            .then(response => response.json())
            .then(data => loadJSON(data))
            .catch(err => console.error(err));
    }

    useEffect(fetchJson, []);

    return (
        <div className="root">
            <div id="title">Presentatie</div>
            <div className="presentation-container">
                <div className="window-top">
                    <Link to="/">X</Link>
                </div>
                <div className="pres-container-inner">
                    <h1>{presentation.title}</h1>
                    <h3>{presentationId}</h3>
                    <p>{presentation.content}</p>
                    <h3>{presentation.author}</h3>
                    <p>{presentation.desc}</p>
                    <button onClick={ directEdit }>Edit</button>
                    <button onClick={ () => deletePresentation() }>Delete</button>
                </div>
            </div>
        </div>
    )
}