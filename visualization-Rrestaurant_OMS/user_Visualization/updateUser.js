// Purpose => Update user information safely
// Inputs => userId (from req.params), updateData (from req.body)
// Checks => Filter dangerous fields, verify user exists
// Actions => Update database with safe fields only
// Output => Formatted updated user object

//filter dangerous fields
function filterUpdateData(updatedData){
    const {password, role , ...allowedUpdates } = updatedData; //fiter excluding password and role
    return allowedUpdates;
}

//Update User In Databse
async function updateUserInDatabase(userId, allowedUpdates) {
    const user = await UserActivation.findByIdAndUpdate(
        userId,
        allowedUpdates,
        {
            new: true,
            runValidators: true
        }
    ).select('-password');
    return user;
}

function checkUserExists(user){
    if(!user){
        throw {
            status: 404,
            message: 'User not found'
    };
}
}

function formatUserResponse(user) {
    return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
    };
}

async function updateUser(userId, updateData) {
    const allowedUpdates = filterUpdateData(updateData);
    const user = await updateUserInDatabase(userId, allowedUpdates);
    checkUserExists(user);
    const formattedUser = formatUserResponse(user);
    return formattedUser;
}