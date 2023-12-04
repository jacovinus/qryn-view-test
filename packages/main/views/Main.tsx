import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "isomorphic-dompurify";
import { UpdateStateFromQueryParams } from "../helpers/UpdateStateFromQueryParams";
import { useMediaQuery } from "react-responsive";
import { setTheme } from "@ui/store/actions";
import { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileView } from "./Main/MobileView";
import { DesktopView } from "./Main/DesktopView";
import { useCookiesAvailable, useUrlAvailable } from "./Main/hooks";
import {
    updateDataSourcesWithUrl,
    updateDataSourcesFromLocalUrl,
} from "./Main/helpers";

import { css, cx } from "@emotion/css";
import useTheme from "@ui/theme/useTheme";
import { setCurrentUser } from "./User/actions";

const MainStyles = (theme: any) => css`
    background: ${theme.shadow};
`;

export default function Main() {
    const navigate = useNavigate();
    const dataSources = useSelector((store: any) => store.dataSources);
    // get hash from current location
    const { hash } = useLocation();
    // get url params as object
    const paramsMemo = useMemo(() => {
        return new URLSearchParams(hash.replace(/#/, ""));
    }, [hash]);

    UpdateStateFromQueryParams();
  // cookieAuth will be the cookie object
    const { cookiesAvailable, cookieAuth, cookieUser } = useCookiesAvailable(paramsMemo);

    const { urlAvailable, url } = useUrlAvailable(paramsMemo);

    useEffect(() => {
        const onlyCookie = cookiesAvailable && !urlAvailable;
        const onlyUrl = !cookiesAvailable && urlAvailable;
        const urlAndCookie =
            cookiesAvailable &&
            cookieAuth &&
            urlAvailable &&
            urlAvailable !== "";
        // else, take url from location
        if (onlyCookie || onlyUrl || urlAndCookie) {
            // update datasources with url and basic auth
            updateDataSourcesWithUrl(
                dispatch,
                url,
                cookieAuth,
                urlAvailable,
                cookiesAvailable,
                dataSources
            );

        } else {
            updateDataSourcesFromLocalUrl(dataSources, dispatch, navigate);
        }
    
    }, []);

    useEffect(()=>{
  
        if(cookieUser && typeof cookieUser === 'string') {
            try {
                dispatch(setCurrentUser(JSON.parse(cookieUser)))

            } catch(e) {
                console.log(e)
            }
        }
    
    },[cookieUser])

    useEffect(() => {
        const urlSetting = {
            url: DOMPurify.sanitize(window.location.hash),
            cookiesAvailable,
        };

        localStorage.setItem(
            btoa("cookie-location"),
            btoa(JSON.stringify(urlSetting))
        );
    }, [cookiesAvailable]);

    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1013px)" });
    const isAutoDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
    const dispatch: any = useDispatch();
    const isSplit = useSelector((store: any) => store.isSplit);
    const isEmbed = useSelector((store: any) => store.isEmbed);
    const theme = useTheme();
    const autoTheme = useSelector((store: any) => store.autoTheme);
    const settingsDialogOpen = useSelector(
        (store: any) => store.settingsDialogOpen
    );

    useEffect(() => {
        if (autoTheme) {
            const theme = isAutoDark ? "dark" : "light";
            dispatch(setTheme(theme));
            localStorage.setItem(
                "theme",
                JSON.stringify({ theme: theme, auto: autoTheme })
            );
        }
    }, [isAutoDark, autoTheme, dispatch]);
    
    const viewRenderer = (
        isTabletOrMobile: boolean,
        isSplit: boolean,
        isEmbed: boolean,
        settingsDialogOpen: boolean
    ) => {
        if (!isTabletOrMobile) {
            // desktop view
            return (
                <DesktopView
                    isEmbed={isEmbed}
                    isSplit={isSplit}
                    theme={theme}
                    settingsDialogOpen={settingsDialogOpen}
                />
            );
        } else {
            // mobile view
            return (
                <MobileView
                    isEmbed={isEmbed}
                    theme={theme}
                    settingsDialogOpen={settingsDialogOpen}
                />
            );
        }
    };

    return (
        <div className={cx(MainStyles(theme))}>
            {viewRenderer(
                isTabletOrMobile,
                isEmbed,
                isSplit,
                settingsDialogOpen
            )}
        </div>
    );
}
