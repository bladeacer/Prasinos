import { UserSiteButton, StaffLoginButton, ImageBox, StaffRegisterButton } from "./reusables/components/sel_login_components"
import imgUrl from '../assets/prasinos-logo.jpg';

export default function SelectLogin() {
    return (
        <>
            <ImageBox
                component="img"
                alt="Prasinos logo"
                src={imgUrl}
            />
            <UserSiteButton href="/home">Click me to go to user site</UserSiteButton>
            <StaffLoginButton href="/staffLogin">Click me to login on the staff site</StaffLoginButton>
            <StaffRegisterButton href="/staffRegister">Click me to register on the staff site</StaffRegisterButton>
        </>
    )
}