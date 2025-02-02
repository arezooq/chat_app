const ProfileSettings = ({ user, setUser }) => {
    return (
      <div className="user-info">
        <h2>ویرایش اطلاعات</h2>
        <input
          type="text"
          placeholder="نام"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setUser({ ...user, profile: url });
          }}
        />
        <img src={user.profile} alt="profile" className="profile-preview" />
      </div>
    );
  };
  
  export default ProfileSettings;
  