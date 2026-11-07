interface ProfileHeaderProps {
  titulo: string;
  descripcion: string;
}

function ProfileHeader({ titulo, descripcion }: ProfileHeaderProps) {
  return (
    <div className="perfil-header">
      <h1>{titulo}</h1>
      <p>{descripcion}</p>
    </div>
  );
}

export default ProfileHeader;