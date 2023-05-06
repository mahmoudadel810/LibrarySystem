import { bookModel } from "../../DB/models/bookModel.js";
import { tokenFunction } from "../../utils/tokenFunction.js";
import moment from "moment/moment.js";
//----------------------------------getAllbook------------------------------------------------

export const getAllBook = async (req, res) =>
{
    try
    {
        // ##get all Users Books So i didn't use  { _id} = req.user or even addedBy 

        const books = await bookModel.find();

        return res.json({ message: 'books retrieved successfully', books });
    }
    catch (error)
    {
        res.status(500).json({ message: 'Error retrieving books', error: error.message });
    }
};


//---------------------------------------addbook-------------------------------------------------


export const addBook = async (req, res) =>
{
    try
    {
        const { name, title, author } = req.body;
        const { _id } = req.user;


        const newbook = new bookModel({
            name, title, author,
            addedBy: _id,
            issuedDate: Date.now(),
            returnedDate: '' // ||null

        });
        const savedbook = await newbook.save();
        savedbook
            ? res.json({ message: 'New book Added Success', savedbook })
            : res.json({ message: 'Can Not add New book' });

    }
    catch (error)
    {
        if (error.code == 11000)
        { return res.json({ message: 'Book Already exist' }); }
        return res.status(500).json({ message: 'Catch error', error: error.message });
    }
};
//------------------------------------coverPicture--------------------------------------------------
//Main Profile Picture For the Book .
export const coverPicture = async (req, res) =>
{
    try
    {

        if (!req.file)
        {
            return res.status(400).json({ message: 'Please Select Your Pictures !' });
        }
        const { _id } = req.user;

        console.log(req.file);

        const book = await bookModel.findOneAndUpdate({ addedBy: _id },
            { cover_pic: req.file.path });

        console.log(book);


        if (!book)
        {
            return res.status(400).json({ message: 'Please try to login again' });
        }
        return res.status(200).json({ message: ' Added Done !' });
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({ message: 'Catch error', error: error.message });

    }
};
//--------------------------------------bookPictures----------------------------------------------------
//this should contain all pictures of the book .. like Discover the book u want to issue !

export const bookPictures = async (req, res) =>
{
    try
    {

        if (!req.files.length)
        {
            return res.json({ message: 'Please Select Your Pictures !' });
        }

        const { _id } = req.user;

        let coverArray = [];

        for (const file of req.files)
        {
            coverArray.push(file.path);
        }

        const pics = await bookModel.findOneAndUpdate({ addedBy: _id },
            { Book_Pictures: coverArray });

        if (!pics)
        {
            return res.status(400).json({ message: 'Please Try Again ......!' });
        }
        return res.status(200).json({ message: 'Book Pictures Added Successfully !' });
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({ message: 'Catch error', error: error.message });
    }
};
//---------------------------------issueaBook-----------------------------------------------------------

export const issueaBook = async (req, res) =>
{
    try
    {
        const { bookId } = req.params;

        const { _id } = req.user;



        const issuedBook = await bookModel.updateOne({
            _id: bookId,
            status: { $eq: 'not-issued' },
            returnedDate: { $eq: '' }, //  ||null
            addedBy: _id
        },
            {                                           //days||hours||minitus||seconds||millisecond
                $set: { returnedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'issued' },
            } // After 5 days . Returning allowed 5 days after that will be there Fine 50$ per day

        );
        issuedBook.modifiedCount > 0
            ? res.json({ message: 'Return Date Updated', issuedBook })
            : res.json({ message: 'Can Not Set New Date' });
    } catch (error)
    {
        return res.status(500).json({ message: 'Error Issuing Book', error: error.message });
    }
};


//--------------------------------allissued-------------------------------------------------------------

export const allissued = async (req, res) =>
{
    try
    {
        //If you want to get all issued by all users , just delete {_id} , No worries .......
        const { _id } = req.user;

        const find = await bookModel.find(
            { addedBy: _id, status: { $eq: 'issued' } }
        );

        if (find)
        {

            return res.json({ message: 'This All Issued Books', find });
        } else
        {
            return res.json({ message: 'No Issued Books Left' });
        }
    } catch (error)
    {
        return res.status(500).json({ message: 'Un Known Error', error: error.message });

    }
};
//------------------------------------search--------------------------------------------
export const search = async (req, res) =>
{
    try
    {
        const { _id } = req.user;
        const { name } = req.query;

        const check = await bookModel.findOne({ name, addedBy: _id });

        if (check)
        {
            return res.json({ message: 'Book Found:', check });
        } else
        {
            return res.status(404).json({ message: 'Book Not Found' });
        }
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: 'Error searching for Book', error: error.message });
    }
};
//---------------------------------notReturnedall--------------------------------------------
export const notReturnedall = async (req, res) =>
{
    try
    {

        // const { _id } = req.user;  #Un comment to get unreturned for this specific user , and use addBy: _id

        const find = await bookModel.find(
            { returnedDate: { $ne: Date.now() && '' } }
        );
        if (find)
        {
            await bookModel.updateOne({});

            return res.json({ message: 'This All Not Returned Books', find });
        } else
        {
            return res.json({ message: 'All Books Returned , Or no Issued Books' });
        }
    } catch (error)
    {
        return res.status(500).json({ message: 'Un Known Error', error: error.message });

    }
};
//----------------------------------notReturned--------------------------------------------------

export const notReturned = async (req, res) =>
{
    try
    {
        const { _id } = req.user;

        const books = await bookModel.find({ addedBy: _id, status: 'issued' });

        const currentDate = moment();
        const fiveDaysAgo = moment().subtract(5, 'days');

        const lateBooks = [];

        for (const book of books)
        {
            const issuedDate = moment(book.issuedDate);
            const returnedDate = moment(book.returnedDate);

            if (returnedDate.isAfter(fiveDaysAgo))
            {
                continue;
            }

            const daysLate = currentDate.diff(returnedDate, 'days');
            const fine = daysLate * 50;

            lateBooks.push({
                ...book.toObject(),
                late: true,
                fine,
            });

            await bookModel.updateOne(
                { _id: book._id, status: 'issued', latebooks: lateBooks.length },

                { $set: { late: true, fine } },
                { $new: true }

                ,
            );
        }

        if (lateBooks.length === 0)
        {
            return res.json({ message: 'No Late Books Found' });
        }

        return res.json({ message: 'These Books Are Late', lateBooks });
    } catch (error)
    {
        return res.status(500).json({ message: 'Unknown Error', error: error.message });
    }
};

//-----------------------------notreturnedSearch------------------------------------------------

export const notreturnedSearch = async (req, res) =>
{
    try
    {
        const { _id } = req.user;
        const { name } = req.query;

        const currentDate = moment();
        const fiveDaysAgo = moment().subtract(5, 'days');

        const books = await bookModel.find({ name, addedBy: _id, status: 'issued', returnedDate: { $lte: fiveDaysAgo } });

        if (books.length)
        {
            return res.json({ message: 'Late Books Found:', books });
        } else
        {
            return res.status(404).json({ message: 'No Late Books Found' });
        }
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: 'Error searching for late Books', error: error.message });
    }
};






