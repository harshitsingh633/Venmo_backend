import jwt from "jsonwebtoken";
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = (req , res , next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status.json({});
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token , JWT_SECRET);
        if(decoded.userId){req.userId = decoded.userId;
        next();
        }
        
    }catch(e){
        return res.status(403).json({}); 
    }
}