async function getUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    
    return response;
};

export { getUser };