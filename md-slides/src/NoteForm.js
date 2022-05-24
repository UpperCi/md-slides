import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "./TextField.js";

export function NoteForm({_handleSubmit = () => {}, _pres = {'title':'','content':'','desc':'','author':''}}) {
    console.log(_pres)
    const [title, setTitle] = useState(_pres.title);
    const [content, setContent] = useState(_pres.content);
    const [desc, setDesc] = useState(_pres.desc);
    const [author, setAuthor] = useState(_pres.author);
    console.log(title, content, desc, author)

    return (
        <div className="root">
            <div id="title">Create</div>
            <div className="presentation-container">
                <div className="window-top">
                    <Link to="/">X</Link>
                </div>
                <div className="pres-container-inner">
                    <form onSubmit={(e) => {_handleSubmit(e, title, content, desc, author)}}>
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
