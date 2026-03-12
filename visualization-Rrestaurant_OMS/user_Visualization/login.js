//Purpose:Authenticate and login user, provide access token

//what do i need to think here like what do i need
//required roles
// input validation = email pass

//user  does user uexists
//role auhtentication
//password verification
//token gen
//store refresh tokens in db
//main logic

const requiredRoles = [ 'customer', 'admin'];
async function validateLoginInputs(email, password){
    if(!email || !password){
        throw { 
            status: 400,
            message: 'Email and password are required'
        };
    }
}

//find user
async function findUserByEmail(email){
    const user = await UserActivation.findUserByEmail(email);
    if(!user){
        throw{
            status: 404,
            message: 'User not found'
        }
    }
    return user;
}

//role auhtentication
function checkUserRole(user, requiredRole) {
    if(requiredRole && user.role != requiredRole){
        throw{
            status: 403,
            message: `Access denied . only ${requiredRole} allowed`
        };
    }
}

//password verification
async function verifyUserPassword(inputPassword, storedPassword){
    const isValid = await bcrypt.compare(inputPassword, storedPassword);
    if(!isValid){
        throw {
            status: 401,
            message: 'Invalid credientials'
        };
    }
}

//Token Generation
async function generateUserToken(user){
    const accessToken = jwt.sign(
       { userId: user.id, role: user.role},
       Process.env.JWT_SECRET,
       {expiresIn: '1h'}
    );
    const refreshToken = jwt.sign(
        {userId: user.id},
        Process.env.JWT_REFRESH_SECRET,
        {expiresIn: '7d'}
    );
    //soter
    await User.updateRefreshTOken(user.id, refreshToken);
    return {accessToken, refreshToken};
}

//mainlogic
async function userLogin(email, password, requiredRole = null ){
    try{
        //input Validation
        await validateLoginInputs(email, password);
        //find user
        const user = await findUserByEmail(email);
        //verify pass
        await verifyUserPassword(password, user.password);
        //gen token
        const tokens = await generateUserToken(user);
        return{
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            ...tokens
        };
    }catch(error){
        throw error;
    }
}