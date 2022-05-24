import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Create } from "./Create.js";
import { Detail } from "./Detail.js";
import { Edit } from "./Edit.js";
import { Overview } from "./Overview.js";
import './dist/App.css';

function App() {
    return (
        <BrowserRouter>
            <div id="bg-lines"></div>
            <Routes>
                <Route path="/" element={<Overview />}></Route>
                <Route path="/detail/:presentationId" element={<Detail />}></Route>
                <Route path="/create/" element={<Create />}></Route>
                <Route path="/edit/:presentationId" element={<Edit />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
