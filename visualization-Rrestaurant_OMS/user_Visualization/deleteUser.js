// Purpose => Permanently delete a user from database
// Inputs => userId (from req.params)
// Checks => User exists
// Actions => Delete user from database
// Output => Success message or error


async function deleteUserFromDatabase(userId) {
    const user = await User.findByIdAndDelete(userId);
    // User.findByIdAndDelete() => Finds and deletes user in one operation
    // Returns deleted user document OR null if not found
    // await => Wait for database operation to complete
    
    return user;  // Returns deleted user or null
}


function checkUserExists(user) {
    if (!user) {
        throw {
            status: 404,
            message: 'User not found'
        };
    }
}


async function deleteUser(userId) {
    // PART 1: Delete user from database
    const user = await deleteUserFromDatabase(userId);
    
    // PART 2: Check if user existed
    checkUserExists(user);
    
    // Return success (or could return deleted user info)
    return {
        success: true,
        message: 'User deleted successfully'
    };
}
