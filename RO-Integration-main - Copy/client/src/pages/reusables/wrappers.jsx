import Register from '../Register';
import Login from '../Login';
import Home from '../Home';
import Booking from '../Booking'
import Events from '../Events'
import Rewards from '../Rewards'
import Support from '../Support'
import SelectLogin from '../selectLogin';
import ForgetPassword from '../ForgetPassword';
import { is_accent } from './accent_parser';

export function HomeWrapper() {
    return (
        <>
            {is_accent[0] && (
                <>
                    <Home/>
                </>
            )}
        </>
    )
}
export function BookingWrapper() {
    return (
        <>
            {is_accent[1] && (
                <>
                    <Booking/>
                </>
            )}
        </>
    )
}
export function EventWrapper() {
    return (
        <>
            {is_accent[2] && (
                <>
                    <Events/>
                </>
            )}
        </>
    )
}
export function RewardsWrapper() {
    return (
        <>
            {is_accent[3] && (
                <>
                    <Rewards/>
                </>
            )}
        </>
    )
}
export function SupportWrapper() {
    return (
        <>
            {is_accent[4] && (
                <>
                    <Support/>
                </>
            )}
        </>
    )
}
function LoginWrapper() {
    return (
        <>
            {is_accent[5] && (
                <>
                    <Login/>
                </>
            )}
        </>
    )
}

function RegisterWrapper() {
    return (
        <>
            {is_accent[6] && (
                <>
                    <Register/>
                </>
            )}
        </>
    )
}

function ForgetWrapper() {
    return (
        <>
            {is_accent[11] && (
                <>
                    <ForgetPassword />
                </>
            )}
        </>
    )
}

export function SelectLogWrapper() {
    return (
        <>
            {is_accent[8] && (
                <>
                    <SelectLogin/>
                </>
            )}
        </>
    )
}


export function EverythingWrapper() {
    // Used in overlay effect
    return (
        <>
            {RegisterWrapper()}
            {LoginWrapper()}
            {BookingWrapper()}
            {RewardsWrapper()}
            {EventWrapper()}
            {SupportWrapper()}
            {HomeWrapper()}
            {SelectLogWrapper()}
            {ForgetWrapper()}
        </>
    )
}