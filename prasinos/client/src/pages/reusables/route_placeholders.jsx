import { Route } from 'react-router-dom';

export default function RoutePlaceholder(is_user_placeholder) {
    return (
        <>
            {is_user_placeholder && (
                <>
                    <Route path={"/home"} element={<></>} />
                    <Route path={"/booking"} element={<></>} />
                    <Route path={"/events"} element={<></>} />
                    <Route path={"/rewards"} element={<></>} />
                    <Route path={"/support"} element={<></>} />
                    <Route path={"/settings"} element={<></>} />
                    <Route path={"/dangerZone"} element={<></>} />
                    <Route path={"/register"} element={<></>} />
                    <Route path={"/login"} element={<></>} />
                    <Route path={`/edit`} element={<></>} />
                    <Route path={`/reset`} element={<></>} />
                </>
            )}
            {!is_user_placeholder && (
                <>
                    <Route path={"/staffLogin"} element={<></>}></Route>
                    <Route path={"/staffRegister"} element={<></>}></Route>
                    <Route path={"/staffHome"} element={<></>}/>
                </>
            )}
        </>
    )
}