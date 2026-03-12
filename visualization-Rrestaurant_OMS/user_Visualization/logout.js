//Purpose => log out user by invalidating theri token
//Input=> token (refreshtoken)
//checks=> token exists and can be deleted
//action=> validatetoken -> Delete from Database
//Output => success message

async function validateLogoutToken(token) {
    if(!token){
        throw {
            status: 400,
            message: 'Token is required'
        };
    }
}

async function deleteRefreshToken(token) {
    const result = await RefreshToken.deleteOne({token});
    if(result.deletedCount === 0){
        throw {
            status: 404,
            message: 'Token not found'
        };
    }
    return result;
}


async function userLogout(token) {

try {
    await validateLogoutToken(token);
    await deleteRefreshToken(token);
    return {
        success: true,
        message: ' Loggedout successfully'
    };
} catch (error) {
    throw error;
}

}
