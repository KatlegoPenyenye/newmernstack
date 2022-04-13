import jwt from 'jsonwebtoken';


// verify tokens before using any routes, confirm or deny requests
const auth = async (req, res, next) => {
    try {
     //   console.log(req.headers);
        /*
        Once we’ve created a router object, we can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.
        */
        const token = req.headers.authorization.split(" ")[1];
        const isCustumAuth = token.length < 500;

        let decodedData;

        if (token && isCustumAuth ) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;  // for property undefined not error
        }
        else{
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}
export default auth;
        

