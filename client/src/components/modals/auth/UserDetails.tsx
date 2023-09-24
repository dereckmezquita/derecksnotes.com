interface UserDetailsProps {
    userData: UserInfo;
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userData, onClose }) => {
    return (
        <>
            <h2>Welcome, {userData.username}</h2>
            {/*... existing user details JSX */}
        </>
    );
};

export default UserDetails;
