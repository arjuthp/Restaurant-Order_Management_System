//Purpose => retrieves all users from database for admin viewin gonly
//inputs => user, userRole
//checks => v user is adminerify
// action=> fetch all user from db excluding password && foramt each eresp removinfg sensitive data
//op= > array od data  with userlist



async function getAllUsers (user, userRole){
    //check: verify admin
    if(userRole !=='admin'){
        throw {status: 403,
            message: 'Accesss denied.Only admins can view all users'

        };
    }
    //action :A1 => Query db for all user excluding password
    const users = await  UserActivation.find().select('-password');
    //A2 => format users
    const formattedUsers = users.map(user => formatUserResponse(user));
    return formattedUsers;
}

function formatUserResponse(user){
    return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address 
    };
}