// import { sign } from "jsonwebtoken";
// import User from "../models/UserModel";
// import { generateAccessToken } from "../utils/tokens";

// const maxAge = 60 * 60 * 1000; //1hr
// const generateAccessToken = (user) => {
//     const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
//     return  accessToken;
// };

// export const signUp = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).send("Email & Password is required")
//         }
//         const user = await User.create({ email, password });
//         res.cookie("jwt", generateAccessToken(user), {
//             maxAge,
//             secure: true,
//             sameSite: "None",
//         });
//         res.status(200).json()
//     } catch (error) {
//         return res.status(500).send("Internal Server Error")
//     }
// }