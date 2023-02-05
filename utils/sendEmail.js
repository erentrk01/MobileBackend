require('dotenv').config(); 
const nodemailer=require('nodemailer');
module.exports= async(email,subject,text)=>{
	try{
		const transporter=nodemailer.createTransport({
			host:process.env.HOST,
			service:process.env.SERVICE,
			port:Number(process.env.EMAIL_PORT),
			secure:Boolean(process.env.SECURE),
			auth:{
				user:"netcadvtk@gmail.com",
				pass:"exmguqksqvvigtfa"
			}
		});

		const info= await transporter.sendMail({
			from:process.env.USER,
			to:email,
			subject:subject,
			text:text,

		});
		console.log("Email sent successfully");
	}
	catch(error){
		console.log("Email not send!");
		console.log(error);
	}

}