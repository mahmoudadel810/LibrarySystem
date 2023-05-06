import nodemailer from 'nodemailer';


export const sendEmail = async ({ to = '', message = '', subject = '' }) =>
{
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 587,
        secure: false, // tls ? encrypt connection between two sides : not encrypt until port is suppor ..465
        service: 'gmail',
        auth: {
            user: 'abo3adelf@gmail.com',
            pass: 'inqgihveizcgvvuj'
        },
        cc: ['', ''] // send to another emails , beside the main one sent to .
    });

    let info = await transporter.sendMail({
        from: 'abo3adelf@gmail.com',
        to,
        subject,

        html: message,

    });
    console.log(info);

    if (info.accepted.length)
    {
        return true;
    }
    return false;










};