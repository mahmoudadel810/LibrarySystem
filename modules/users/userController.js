import { userModel } from '../../DB/models/userModel.js';
import { sendEmail } from '../../services/sendEmail.js';
import { compareFuncion, hashFunction } from "../../utils/generateHash.js";
import { tokenFunction } from '../../utils/tokenFunction.js';
import { nanoid } from 'nanoid';
import cloudinary from '../../utils/cloudinary.js';



//------------------------------------------------__--------------------------------------


//--------------------------------------signUp----------------------------------------------------

export const signUp = async (req, res) =>
{
    try
    {
        const { name, email, password, phone } = req.body;
        // const date = Date.now()
        const hashedPass = hashFunction({ payload: password });
        const newUser = new userModel({ name, email, password: hashedPass, phone, registerDate: Date.now() });

        const token = tokenFunction({ payload: { _id: newUser._id } });
        const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/ass9/user/confirmEmail/${token}`;
        const emailed = await sendEmail({
            to: newUser.email,
            subject: 'confirmationEmail',
            message: `<a href = ${confirmationLink}> Click To Confirm please</a>`
        });

        if (emailed)
        {
            await newUser.save();
            res.json({ message: 'User Signed Up ! , Go Now to Confirm your Gmail Please' });
        } else
        {
            res.json({ message: 'Failed Signing Up' });
        }
    }
    catch (error)
    {
        if (error.code == 11000)
        { return res.json({ message: 'Email Already exist' }); }

        return res.json({ message: 'Catch Error', error: error.message });


    }

};
//-------------------------------------confirmEmail--------------------------------------------------

export const confirmEmail = async (req, res) =>
{
    const { token } = req.params;

    const decode = tokenFunction({ payload: token, generate: false });

    if (decode?._id)
    {
        const user = await userModel.findOneAndUpdate({ _id: decode._id, confirmed: false },
            { $set: { confirmed: true } });

        if (!user)
        {
            return res.status(200).json({ message: 'Already Confirmed !' });
        }
        return res.status(200).json({ message: 'Confirmation Done , please Login Now' });
    }

};

//–––––––––––––––––––––––––––––––––––-signIn----------––––––––––––––––––––––––––––––-------------------

export const signIn = async (req, res) =>
{
    try
    {
        const { email, password } = req.body;

        const usercheck = await userModel.findOne({ email, confirmed: true });
        if (usercheck)
        {
            const match = compareFuncion({ payload: password, referenceData: usercheck.password });
            if (match)
            {
                const token = tokenFunction({ payload: { id: usercheck._id, email: usercheck.email, name: usercheck.name } });

                await userModel.findOneAndUpdate({ email },
                    { $set: { isLoggedIn: true, Active: true } });
                if (token)
                {
                    return res.json({ message: 'Login Success', token: token });

                } else
                {
                    res.json({ message: 'Token Generation Fail' });

                }
            } else
            {
                return res.json({ message: 'In-Valid Login Information' });

            }
        } else
        {
            return res.json({ message: 'In-Valid Login Information' });

        }
    }
    catch (error)
    {
        return res.json({ message: 'Catch Error ', error: error.message });

    }
};
//------------------------------------updatePassword---------------------------------------------------------
export const updatePassword = async (req, res) =>
{
    try
    {
        const { oldpassword, newpassword, confirmnew } = req.body; // confirmation in validation
        const { _id } = req.user;

        const usercheck = await userModel.findOne({ _id });
        if (!usercheck)
        {
            return res.status(400).json({ message: 'Try To Sign In First please , ', logOut }); //#readable step only 
        }
        const hashedNewPass = hashFunction({ payload: newpassword });


        const match = compareFuncion({ payload: oldpassword, referenceData: usercheck.password });
        const hashedOldPass = hashFunction({ payload: oldpassword });

        if (match)
        {
            // console.log(match); // true if match

            const update = await userModel.findOneAndUpdate({ _id },
                { $set: { password: hashedNewPass } }, { new: true });
            res.status(200).json({ message: 'Password updated', update });
        } else
        {
            res.json({ message: 'Cannot update password. Old password does not match.' });
        }
    }


    catch (error)
    {
        console.log(error);
        res.json({ message: 'Catch Error ', error: error.message });
    }
};

//-------------------------------------resetPassword-----------------------------------------------

export const resetPassword = async (req, res) =>
{
    try
    {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user)
        {
            return res.status(404).json({ message: 'User Can not found to reset pass' });
        }
        const code = nanoid(); // code in Schema defult Null ||const code = Math.floor(1000 + Math.random() * 9000); 4 digitsNumber

        const emailed = await sendEmail({
            to: email,
            subject: 'Reset your Password',
            message: `your Password Reset code is : ${code}`
        });


        if (emailed)
        {
            user.code = code; // Add the code to the user
            await user.save(); // Save the updated user to the database
            return res.status(200).json({ message: 'Code generated successfully.', code });
        } else
        {
            res.json({ message: 'Failed Send Message' });
        }

    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({ message: 'Error generating code.', error: error.message });
    }
};
//--------------------------------------verifyReset-------------------------------------------------

export const verifyReset = async (req, res) =>
{
    try
    {
        const { code, newPassword, confirmNewPassword } = req.body; // confirm in validation

        const user = await userModel.findOne({ code });

        if (!user)
        {
            return res.status(400).json({ message: "Invalid code provided" });
        }


        const hashedPassword = hashFunction({ payload: newPassword });

        // Update  user password and reset the code to null again for future resets
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user._id },
            {
                $set: { password: hashedPassword, code: nanoid() } //لو اتساب فاضي ممكن يتبعت عادي حتي لو مبعتش
            },
            { new: true }
        );

        res.status(200).json({ message: "Password updated successfully", user: updatedUser });
    }
    catch (error)
    {
        console.log(error);
        res.status(500).json({ message: "Error updating password", error: error.message });
    }
};

//----------------------------------------updateProfile---------------------------------------

export const updateProfile = async (req, res) =>
{
    try
    {
        const { name, phone } = req.body;  // i wont send email , front end add button disabled .
        const { _id } = req.user;

        const user = await userModel.findById(_id);

        const update = await userModel.findByIdAndUpdate(_id,
            { name, phone, },
            { new: true }
        );

        update
            ? res.json({ message: 'Updated Done', update })
            : res.json({ message: 'Update Failed' });
    }


    catch (error)
    {
        return res.json({ message: 'Catch Error ', error: error.message });
    }
};
//----------------------------------prfilePicture-------------------------------------------------

export const profilePicture = async (req, res) =>
{
    try
    {
        if (!req.file)
        {
            res.status(400).json({ message: 'Please Select Your Pictures !' });
        }
        const { _id } = req.user;

        console.log(req.file);

        const user = await userModel.findByIdAndUpdate(_id,
            { profilePic: req.file.path });



        if (!user)
        {
            res.status(400).json({ message: 'Please try to login again' });
        }
        res.status(200).json({ message: ' Added Done !' });

    }

    catch (error)
    {
        console.log(error);
        return res.json({ message: 'Catch Error ', error: error.message });

    }
};
//-----------------------------------cloudProfile------------------------------------------------

export const cloudProfile = async (req, res) =>
{
    try
    {

        if (!req.file)
        {
            res.status(400).json({ message: 'please select your Profile' });
        }
        const { name, _id } = req.user;

        console.log(req.file.filename);

        const image = await cloudinary.uploader.upload(req.file.path, {
            folder: `Images/${name}/profile`,
            // public_id : nanoid(), // اللي همسك بيه الصوره واعدل عليها
            // public_id: req.file.filename + Date.now(), //بيغير الاسم unique ,
            use_filename: true, //هيستخدم اسم الفايل الاصلي //defult false .
            unique_filename: false,// مش هيرجع اسم طويل يونيك defult true .
            // resource_type: '' // image || video || row || auto == defult for frontend ||image for backend


        });

        const user = await userModel.findByIdAndUpdate(_id,
            {
                profilePic: image.secure_url,
                // public_id : nanoid() // ناديته تاني عشان اعدل عليه || : public_id
            });

        if (!user)
        {
            res.status(400).json({ message: "Please Try again Later" });
        }
        res.status(200).json({ message: "Uploaded Done", image });
    }

    catch (error)
    {
        return res.json({ message: 'Catch Error ', error: error.message });

    }
};














//----------------------------------softDelete----------------------------------------

export const softDelete = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const { _id } = req.user;

        const soft = await userModel.updateOne(
            { _id: userId, status: { $eq: 'Active' } },
            { $set: { status: 'In-Active' } }
        );

        if (soft.modifiedCount > 0)
        {
            return res.json({ message: 'User Now InActive', soft });
        } else
        {
            return res.json({ message: 'Failed Deactivating' });
        }
    } catch (error)
    {
        return res.status(500).json({ message: 'Error deactivating user', error: error.message });

    }
};

//-----------------------------------deleteProfile-------------------------------

export const deleteProfile = async (req, res) =>
{
    try
    {
        const { _id } = req.user; // اليوزر اللي عامل تسجيل دخول
        // const { user_id } = req.params;


        const user = await userModel.deleteOne(_id);

        user
            ? res.json({ message: 'Delete Done', user })
            : res.json({ message: 'can not delete' });


    }
    catch (error)
    {
        return res.json({ message: 'Catch Error ', error: error.message });

    }
};

//--------------------------------------logOut-------------------------------------------------

export const logOut = async (req, res, next) =>
{
    try
    {
        const { _id } = req.user;

        const user = await userModel.findByIdAndUpdate(_id, {
            isLoggedIn: false,
        });

        user
            ? res.status(200).json({ message: 'Logged Out' })
            : res.status(200).json({ message: ' Failed Logg Out' });

    }
    catch (error)
    {
        return res.json({ message: 'Catch Error ', error: error.message });

    }
};