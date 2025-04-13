function Prestacs() {
    return (
        <div>
            <Header level={2}>Hola, {username} (Usuari)</Header>
            <Paragraph>Grupos: {grupos.join(", ")}</Paragraph>
        </div>
    );
}   

export default Prestacs