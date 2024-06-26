## To run
Use `npm i` in the client and server directories' command line to installed required dependencies which are ignored by GitHub so repeated dependencies with a large size are not stored.

## Note to self
Use `window.location.reload()` whenever the `useNavigate` hook is called for successful login

Add Google Sign-In as an option
 - [ ]  TODO: https://blog.logrocket.com/guide-adding-google-login-react-app/ 

Code user settings, page where they can see their details, danger zone
- [x] TODO: Add phone number to user entity
- [ ] TODO: Add other optional fields to user entity
 - [ ] TODO: Settings page (update account details) 
 - [ ] TODO: details page
 - [ ] danger zone (deleting and resetting account)

Code staff-facing user management page.
- [ ] TODO: Create working staff entity with routes
- [ ] TODO: Manage user interface

**Do not include danger zone for staff facing site**

Make register and login app route appear like an overlay menu
- [x] Add a X close button for login and register routes which navigates back to home route

Make "clickable images" with (where custbox is a box with an image via url or an box component with image src), *do this for every image you see :D*:

```jsx
<CustBox>
    <Button sx={{opacity: 0, zIndex: '5', width: '100%', height: '100%', color: '#fff', '&:hover': {opacity: 1}, textTransform: 'unset', fontSize: '36px', fontWeight: 'bold', textAlign: 'center'}} href="/home">
        Click on me to go back to the home page!
    </Button>
</CustBox>
```

### Front-end stuff
- [ ] Finish adding images and content in homepage and othere pages in styled Box with `component=img` type aah
- [x] Screenshot directly from Figma for images smh
- [x] Make "/" route into "/home", "/" contains pop up of user login or staff login
- [ ] Update app icon in [index.html](prasinos/client/index.html)