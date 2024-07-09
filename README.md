## To run
Use `npm i` in the client and server directories' command line to installed required dependencies which are ignored by GitHub so repeated dependencies with a large size are not stored.

## Note to self
Use `window.location.reload()` whenever the `useNavigate` hook is called for successful login

Add Google Sign-In as an option
 - [ ]  TODO: https://blog.logrocket.com/guide-adding-google-login-react-app/ 

Code user settings, page where they can see their details, danger zone
 - [] TODO: Account details in settings page (make some fields dynamic and add profile pic image)
 - [ ] TODO: staff get put routes
 - [] danger zone (deleting and updating account details)
 - [ ] TODO: Add fields to user entity such as profile pic, events joined, points, tier, company
 - [ ] Root page with nice links user and staff login (50% of screen one colour with gradient type aah)
 - [x] Two formiks one for reset password the other for changing other fields together
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