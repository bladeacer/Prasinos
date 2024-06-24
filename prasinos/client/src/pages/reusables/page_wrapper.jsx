import Register from './../Register'
import Login from './../Login';
import Home from './../Home';
import Booking from './../Booking'
import Events from './../Events'
import Rewards from './../Rewards'
import Support from './../Support'


function falseAll() {
    for (var i = 0; i < is_accent.length; i++) {
        is_accent[i] = false
    };
}

var is_accent = [true, false, false, false, false, false, false, false];
if (window.location.pathname.toString() == "/") {
    falseAll();
    is_accent[0] = true;
}
else if (window.location.pathname.toString() == "/booking") {
    falseAll();
    is_accent[1] = true;
}
else if (window.location.pathname.toString() == "/events") {
    falseAll();
    is_accent[2] = true;
}
else if (window.location.pathname.toString() == "/rewards") {
    falseAll();
    is_accent[3] = true;
}
else if (window.location.pathname.toString() == "/support") {
    falseAll();
    is_accent[4] = true;
}
else if (window.location.pathname.toString() == "/login") {
    is_accent[5] = true;
    is_accent[6] = false;
} else if (window.location.pathname.toString() == "/register") {
    is_accent[6] = true;
    is_accent[5] = false;
}

export function HomeWrapper() {
    return (
        <>
            {is_accent[0] && (
                <>
                    <Home></Home>
                </>
            )}
        </>
    )
}
function BookingWrapper() {
    return (
        <>
            {is_accent[1] && (
                <>
                    <Booking></Booking>
                </>
            )}
        </>
    )
}
function EventWrapper() {
    return (
        <>
            {is_accent[2] && (
                <>
                    <Events></Events>
                </>
            )}
        </>
    )
}
function RewardsWrapper() {
    return (
        <>
            {is_accent[3] && (
                <>
                    <Rewards></Rewards>
                </>
            )}
        </>
    )
}
function SupportWrapper() {
    return (
        <>
            {is_accent[4] && (
                <>
                    <Support></Support>
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
                    <Login></Login>
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
                    <Register></Register>
                </>
            )}
        </>
    )
}

export function EverythingWrapper() {
    return (
        <>

            {RegisterWrapper()}
            {LoginWrapper()}
            {BookingWrapper()}
            {RewardsWrapper()}
            {EventWrapper()}
            {SupportWrapper()}
            {HomeWrapper()}

        </>
    )
}