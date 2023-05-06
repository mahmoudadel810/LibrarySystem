import multer from "multer";
import { customAlphabet, nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url)); //your current location
//---------------------------------------------------------------------------------------------------

export const validation_object = { // in routes
    image: ['image/png', 'image/jpeg', 'image/gif'],
    files: ['application/pdf']
};

// validationobject.files || .image
// export const myMulter = ({customPath ,customValidation}) =>
// {

//     if (!customPath)
//     {
//         customPath = 'general';
//     }
//     if (!customValidation)
//     {
//         customValidation = validation_object.image;
//     }

//     const fullpath = path.join(__dirname, `../uploads/${customPath}`)

//     if (!fs.existsSync(fullpath))
//     {
//         fs.mkdirSync(fullpath , {recursive : true}) // if first folder doesnt exist it create it .
//     }
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) =>
//         {
//             cb(null, fullpath); // fullpath
//         },
//         filename: (req, file, cb) =>
//         {
//             const uniqueName  = nanoid(1) + '__' +file.originalname 
//             cb(null, uniqueName);
//         },

//     });

//     const fileFilter = (req, file, cb) =>
//     {
//         if (customValidation.includes(file.mimetype))
//         {
//             return cb(null , true)
//         }
//         cb('invalid - extension type' , false)
//     }
//     const upload = multer({ fileFilter , storage})
//     return upload;

// };

//--------------------------------------Only On hostCloud----------------------------------------------

export const myMulter = ({ customValidation }) =>
{
    if (!customValidation)
    {
        customValidation = validation_object.image;
    }
    const storage = multer.diskStorage({});
    
const fileFilter = (req, file, cb) =>
{
    if (customValidation.includes(file.mimetype))
    {
        return cb(null, true);
    }
    cb('invalid - extension type', false);
};
const upload = multer({ fileFilter, storage });
return upload;
};