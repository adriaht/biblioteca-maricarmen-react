import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

function Perfil({ userData, onBack }) {
  return (
    <div>
      <Header level={2}>Perfil de {userData.username}</Header>
      <Paragraph>Grupos:</Paragraph>
      <ul>
        {userData.grupos.map((grupo, index) => (
          <li key={index}>{grupo}</li>
        ))}
      </ul>
      <Button text="Volver" onClick={onBack} />
    </div>
  );
}

export default Perfil;