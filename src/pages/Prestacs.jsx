function Prestacs({ username, grupos }) {
    return (
        <div>
            <Header level={2}>Hola, {username} (Bibliotecario)</Header>
            <Paragraph>Grupos: {grupos.join(", ")}</Paragraph>
        </div>
    );
}

export default Prestacs