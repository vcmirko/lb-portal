import bcrypt from 'bcrypt';

// promise wrapper for bcrypthash
const hashPassword = (pw) => {
    const saltrounds = 10
    const hashedPassword = bcrypt.hashSync(pw, saltrounds)
    return hashedPassword
}
// promise wrapper for bcrypt compare
const checkPassword = (pw,hash) =>{
  const match = bcrypt.compareSync(pw,hash)
  return match
}

export default {
    hashPassword,
    checkPassword
};

