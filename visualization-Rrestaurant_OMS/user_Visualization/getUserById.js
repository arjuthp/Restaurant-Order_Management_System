//Purpose => retrieve specific use with their Id for admin viewing only
//inputs => userId, userRole
//checks => user exists? 
//action => if not throw error 404
 //output => give oformatted response
  async function getUserById(userId, userRole){
      if(userRole !=='admin'){
        throw {status: 403,
            message: 'Accesss denied.Only admins can view all users'

        };
    }
    const user = await User.findById(userId.toString().trim()).select('-password');
    if(!user){
        throw {status: 404, message:"User not found"};
    }
    const formattedUsers = formatUserResponse(user);
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
