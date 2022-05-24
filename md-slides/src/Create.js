import { NoteForm } from "./NoteForm.js";
import { useNavigate } from "react-router-dom";

export function Create() {
    const navigate = useNavigate();
    const handleSubmit = (event, title, content, desc, author) => {
        event.preventDefault();
        const options = {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json'},
            body: JSON.stringify({"title": title, "content": content, "desc": desc, "author": author})
        }
        let url = `http://localhost:8001/api/`;

        fetch(url, options)
        .then((response) => response.json())
        .then((data) => navigate(`/detail/${data._id}`))
        .catch((err) => console.error(err));
    }

    return (
        <NoteForm _handleSubmit={handleSubmit} />
    )
}