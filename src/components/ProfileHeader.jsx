import "./ProfileHeader.css";

export default function ProfileHeader({ user }) {
  return (
    <header className="profile">
      <img className="profile__avatar" src={user.avatar_url} alt={user.login} />
      <div className="profile__info">
        <h1 className="profile__name">{user.name || user.login}</h1>
        <a
          className="profile__login"
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{user.login}
        </a>
        {user.bio && <p className="profile__bio">{user.bio}</p>}
        <div className="profile__meta">
          {user.location && <span>📍 {user.location}</span>}
          {user.company && <span>🏢 {user.company}</span>}
        </div>
      </div>
    </header>
  );
}