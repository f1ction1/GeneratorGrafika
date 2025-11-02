import { Outlet } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import classes from "./Root.module.css";

function RootLoyout() {
    return <>
        <MainNavigation />
        <Outlet />
    </>;
}

export default RootLoyout;