//Purpose -> Inputs -> Checks -> Actions -> Outputs
// Purpose
// create a new user avoiding duplication and automatic storage

/** 
 * Inputs => req.body
    - name
    - email = unique
    - password => hashed
    - role
    - phone
    - address
*/
c
async function registerUser(name, emai,password, role = 'customer', phone = null, address = null){
//checks
    const existingUser = await UserActivation.findOne({email});
    if(existingUser){
        throw {status: 400,
            message: "Email already exists"
        };
    }
 // Queries db to see if email already registered to avoid duplication
 //email must be unique

 //ACTION => transfer plaintext to has, create a new user 
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserActivation.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'customer',
        phone,
        address
    });
    return user;
}

registerUser();