import { Request, Response } from 'express';
import md5 from 'md5';
import User from '../../models/user.model';
import ForgotPassword from '../../models/forgotPassword.model';
import Cart from '../../models/cart.model';
import { genOTP } from '../../helpers/generateToken.helper';
import sendMailHelpers from '../../helpers/sendMail.helper';

export const register = (req: Request, res: Response): void => {
  res.render('client/pages/user/register', {
    pageTitle: 'Register',
  });
};

export const registerAccount = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existEmail = await User.findOne({
      email,
      deleted: false,
    });

    if (existEmail) {
      req.flash('error', 'Email already exists!');
      res.redirect('back');
      return;
    }

    const hashedPassword = md5(password);
    const user = new User({ ...req.body, password: hashedPassword });

    await user.save();

    res.cookie('tokenUser', user.token); // Save cookie for using another pages

    req.flash('success', 'Registration successful!');
    res.redirect('/');
  } catch (error) {
    console.error("Error registering account:", error);
    req.flash('error', 'An error occurred during registration.');
    res.redirect('back');
  }
};

export const login = (req: Request, res: Response): void => {
  res.render('client/pages/user/login', {
    pageTitle: 'Login Account',
  });
};

export const loginAccount = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({
      email,
      deleted: false,
    });

    if (!userExist) {
      req.flash('error', "This email doesn't exist!");
      res.redirect('back');
      return;
    }

    if (md5(password) !== userExist.password) {
      req.flash('error', 'Incorrect email or password!');
      res.redirect('back');
      return;
    }

    if (userExist.status === 'inactive') {
      req.flash('error', 'Your account has been blocked.');
      res.redirect('back');
      return;
    }

    res.cookie('tokenUser', userExist.token);

    // Save user_id to cart collection
    await Cart.updateOne(
      { _id: req.cookies.cartID },
      { userID: userExist.id }
    );

    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    req.flash('error', 'An error occurred during login.');
    res.redirect('back');
  }
};

export const logoutAccount = (req: Request, res: Response): void => {
  res.clearCookie('tokenUser');
  res.redirect('/user/login');
};

module.exports.forgot = (req: Request, res: Response): void => {
  res.render('client/pages/user/forgot-password', {
    pageTitle: 'Forgot Password',
  });
};

export const forgotPasswordPost = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const userExist = await User.findOne({
      email,
      deleted: false,
    });

    if (!userExist) {
      req.flash('error', "This email doesn't exist!");
      res.redirect('back');
      return;
    }

    const otp = genOTP(6);

    const forgotPassword = new ForgotPassword({
      email,
      otp,
      expireAt: Date.now(),
    });

    await forgotPassword.save();

    // Send OTP via email
    const subject = 'OTP Verification Code';
    const html = `Your OTP code is valid for 3 minutes: ${otp}. Don't share this code with anyone.`;
    sendMailHelpers(email, subject, html);

    res.redirect(`/user/password/otp-password?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error during forgot password:', error);
    req.flash('error', 'An error occurred while sending OTP.');
    res.redirect('back');
  }
};

export const otpPassword = (req: Request, res: Response): void => {
  const email = req.query.email as string;

  res.render('client/pages/user/otp-password', {
    pageTitle: 'OTP Confirm',
    email,
  });
};

export const otpPasswordPost = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const result = await ForgotPassword.findOne({
      email,
      otp,
    });

    if (!result) {
      req.flash('error', 'Invalid OTP!');
      res.redirect('back');
      return;
    }

    const user = await User.findOne({ email });

    res.cookie('tokenUser', user.token);
    res.redirect('/user/password/reset');
  } catch (error) {
    console.error('Error during OTP verification:', error);
    req.flash('error', 'An error occurred during OTP verification.');
    res.redirect('back');
  }
};

export const resetPassword = (req: Request, res: Response): void => {
  res.render('client/pages/user/reset-password', {
    pageTitle: 'Reset Password',
  });
};

export const resetPasswordPost = async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;
  const tokenUser = req.cookies.tokenUser;

  try {
    // Update password for user
    await User.updateOne(
      { token: tokenUser },
      { password: md5(password) }
    );

    req.flash('success', 'Password changed successfully!');
    res.redirect('/');
  } catch (error) {
    console.error('Error resetting password:', error);
    req.flash('error', 'An error occurred while resetting the password.');
    res.redirect('back');
  }
};

export const infoUser = (req: Request, res: Response): void => {
  res.render('client/pages/user/infor', {
    pageTitle: 'User Info',
  });
};