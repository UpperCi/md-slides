export function TextField({ field, variable, setFunction }) {
    return (
        <label>
            <p>{field}</p>
            <input
                type="text"
                value={variable}
                onChange={(e) => setFunction(e.target.value)}
            />
        </label>
    );
}