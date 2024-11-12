import passport from 'passport';
// Function to start Google authentication process
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'] // Request the user's profile and email information from Google
  });
  
  // Callback function after Google authenticates the user
  export const googleAuthCallback = (req, res) => {
    // Upon successful authentication, redirect the user to your frontend/dashboard
   // res.redirect('/sign in sucessfully'); // Adjust the route as needed
   res.status(200)
   .json({
    "message" : "User created sucessfully",
   });
  };
  