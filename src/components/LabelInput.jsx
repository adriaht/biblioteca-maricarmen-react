function LabelInput({ 
    label,
    type,
    value,
    placeholder,
    onChange,
    autoComplete,
    ...others
}) {
    return (
        <div style={{ marginBottom: "1rem" }} {...others}>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete={autoComplete}
                style={{ display: "block", padding: "0.5rem", width: "100%" }}
            />
            <br />
        </div>
    );
}


export default LabelInput;