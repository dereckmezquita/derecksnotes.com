import User from 'src/models/User';

const isAuthenticated = async (req: any, res: any, next: any) => {
    const { userId } = req.session;

    if (!userId) {
        return res.status(401).json({ message: "You need to be logged in." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid session. Please log in again." });
        }
        // You can add more checks here, e.g., if user is banned, locked, etc.

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({ message: "Authentication failed. Please try again." });
    }
};

export default isAuthenticated;