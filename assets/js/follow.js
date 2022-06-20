const API_KEY = 'aea64958-96f0-45dc-b3cc-e9991afd890e'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function followUser(id){
    const {user, error: errorUser} = await kontenbaseClient.auth.user()
  
  
    console.log(user);
    // if(errorUser){
    //   return console.log(errorUser);
    // }
  
    // const {data, error} = await kontenbaseClient.service("like").create({
    //   thread: [id],
    //   Users: [user._id]
    // })
  
    // if(error){
    //   console.log(error);
    // }
  
    // getThreads()
}