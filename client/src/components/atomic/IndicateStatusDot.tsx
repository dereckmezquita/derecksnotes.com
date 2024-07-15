export const IndicateStatusDot = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    <span
        style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isLoggedIn ? 'green' : 'red',
            marginRight: '10px'
        }}
    />
);
