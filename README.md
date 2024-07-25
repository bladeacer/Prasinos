## To run
Use `npm i` in the client and server directories' command line to installed required dependencies which are ignored by GitHub so repeated dependencies with a large size are not stored.

## Note to self
Use `{ replace: true }` whenever the `useNavigate` hook is called.

Add Google Sign-In as an option
 - [ ]  TODO: https://blog.logrocket.com/guide-adding-google-login-react-app/ 

Code user settings, page where they can see their details, danger zone
- [ ] TODO: *Reset password directs to reset handler route user inputs password (needs passphrase to access reset password in the email url as params). Verify email, email change prompts verification process again when logging in (update user field for verified).*
Done with barebones implementation with this one, to add passphrase feature and test it.


 - [] TODO: Account details in settings page (make some fields dynamic and add profile pic image)
 - [ ] TODO: staff get put routes
 - [ ] danger zone (delete account)
 - [ ] Loading state lobotomy
 - [ ] Write a wrapper function for repetitive code like {`is_accent[x] && user && (...)`} that takes params `x, function_to_run_if_true, function_to_run_if_false` 
 - [ ] TODO: Add fields to user entity such as profile pic, events joined, points, tier, company

 - [ ] Style user and staff sidebar later (add image and stuff to user sidebar)
 - [ ] Tidy up your CSS and replace `marginLeft` with `ml` and stuff
 - [ ] `top: {sm: 0, md: 0,. ...}` for responsive margin top and stuff like that

Code staff-facing user management page.
- [ ] TODO: Code front-end for staff entity with routes and test if working
- [ ] TODO: Staff-facing interface to manage users (edit change pw staff and same for updating users from staff interface)
- [ ] TODO: Staff-facing danger zone has opacity dimming and background page
- [ ] TODO: Add funny text under the navbar image box to function as helper text

**Do not include danger zone for staff facing site**

Make "clickable images" with (where custbox is a box with an image via url or an box component with image src)

```jsx
<CustBox>
    <Button sx={{opacity: 0, zIndex: '5', width: '100%', height: '100%', color: '#fff', '&:hover': {opacity: 1}, textTransform: 'unset', fontSize: '36px', fontWeight: 'bold', textAlign: 'center'}} href="/home">
        Click on me to go back to the home page!
    </Button>
</CustBox>
```

### Front-end stuff
- [ ] Finish adding images and content in homepage and othere pages in styled Box with `component=img` type aah
- [ ] Update app icon in [index.html](prasinos/client/index.html)