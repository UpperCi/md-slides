import { NoteForm } from "./NoteForm.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField } from "./TextField.js";

export function Edit() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [desc, setDesc] = useState("");
    const [author, setAuthor] = useState("");
    const navigate = useNavigate();
    let presentationId = useParams().presentationId;

    const loadJSON = (data) => {
        setTitle(data.title);
        setContent(data.content);
        setDesc(data.desc);
        setAuthor(data.author);
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

    const handleSubmit = (event, title, content, desc, author) => {
        event.preventDefault();
        const options = {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ "title": title, "content": content, "desc": desc, "author": author })
        }
        let url = `http://localhost:8001/api/${presentationId}`;

        fetch(url, options)
            .then((response) => response.json())
            .then((data) => navigate(`/detail/${data._id}`))
            .catch((err) => console.error(err));
    }

    useEffect(fetchJson, []);

    return (
        <div className="root">
            <div id="title">Edit</div>
            <div className="presentation-container">
                <div className="window-top">
                    <Link to="/">X</Link>
                </div>
                <div className="pres-container-inner">
                    <form onSubmit={(e) => {handleSubmit(e, title, content, desc, author)}}>
                        <TextField field="Title: " variable={title} setFunction={setTitle} />
                        <TextField field="Content: " variable={content} setFunction={setContent} />
                        <TextField field="Description: " variable={desc} setFunction={setDesc} />
                        <TextField field="Author: " variable={author} setFunction={setAuthor} />
                        <input type="submit" value="submit presentation" />
                    </form>
                </div>
            </div>
        </div>
    )
}
