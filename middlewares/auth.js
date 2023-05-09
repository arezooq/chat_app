const isLogin = async (req, res, next) => {
    try{

        if(req.session.user){

        }
        else{
            res.redirect('/')
        }

    } catch (error){
        console.log(error.message)
    }
}


const isLogout = async (req, res, next) => {
    try{

        if(req.session.user){

        }
        else{
            res.redirect('/dashboard')
        }

    } catch (error){
        console.log(error.message)
    }
}


export default {
    isLogin,
    isLogout
}