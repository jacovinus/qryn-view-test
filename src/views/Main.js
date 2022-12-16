import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { themes } from "../theme/themes";
import Panel from "../components/Panel/Panel";
import { Notification } from "../qryn-ui/notifications";
import SettingsDialog from "../plugins/settingsdialog/SettingsDialog";
import { UpdateStateFromQueryParams } from "../helpers/UpdateStateFromQueryParams";
import StatusBar from "../components/StatusBar";
import QueryHistory from "../plugins/queryhistory";
import { useMediaQuery } from "react-responsive";
import MainTabs from "./MainTabs.js";
import { setTheme } from "../actions";
import { useMemo, useState, useEffect, useRef } from "react";
import { ResizableBox } from "../plugins/ResizableBox/ResiableBox";
const rightHandle = ['w']
export const MainContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    flex: 1;

    background-color: ${(props) => props.theme.mainBgColor} !important;
    &::-webkit-scrollbar-corner {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: ${(props) => props.theme.scrollbarThumb} !important;
    }
    .panels-container {
        display: flex;
        background: ${({ theme }) => theme.shBgColor};
        height: calc(100vh - 45px);
    }
`;

/**
 *
 * @param {theme, isEmbed, settingsDialogOpen}
 * @returns Mobile View
 */

const PANEL_WIDTH = 10000 // Set width above screen size, that way it doesn't go past "max-width: 100%" and fill container nicely.
export function MobileView({ theme, isEmbed, settingsDialogOpen }) {
    return (
        <ThemeProvider theme={theme}>
            {!isEmbed && <StatusBar />}

            <MainContainer>
                <MainTabs />
            </MainContainer>

            <Notification />
            <SettingsDialog open={settingsDialogOpen} />
            <QueryHistory />
        </ThemeProvider>
    );
}

/**
 *
 * @param {theme, isEmbed, isSplit, settingsDialogOpen}
 * @returns Desktop View
 */

export function DesktopView({ theme, isEmbed, isSplit, settingsDialogOpen }) {
    const [height, setHeight] = useState(0);
    const [widthTotal, setWidthTotal] = useState(0);
    const [widthLeft, setWidthLeft] = useState(0);
    const [widthRight, setWidthRight] = useState(0);
    const [widthLeftPercent, setWidthLeftPercent] = useState(0);
    const [widthRightPercent, setWidthRightercent] = useState(0);
    const [minWidth, setMinWidth] = useState(0);
    const [maxWidth, setMaxWidth] = useState(0);
    const refTotal = useRef(null);
    useEffect(() => {
        const widthTotal = refTotal.current.clientWidth
        setHeight(refTotal.current.clientHeight);
        setWidthTotal(refTotal.current.clientWidth);
        setWidthLeft(widthTotal / (isSplit ? 2 : 1));
        if (isSplit) {
            setWidthRight(widthTotal / 2);
        }
        const realMinWidth = !isSplit ? widthTotal : widthTotal / 4 > 370 ? widthTotal / 4 : 370;
        setMinWidth(realMinWidth);
        const realMaxWidth = !isSplit ? widthTotal : widthTotal - realMinWidth
        setMaxWidth(realMaxWidth);
    }, [
        setWidthLeft,
        setWidthRight,
        setWidthTotal,
        setHeight,
        setMinWidth,
        setMaxWidth,
        minWidth,
        isSplit,
    ]);
    const windowWidth = window.innerWidth;
    useEffect(() => {
        const widthTotal = windowWidth;
        setWidthLeftPercent(widthLeft / widthTotal);
        if (isSplit) {
            setWidthRightercent(widthRight / widthTotal);
        }
    }, [widthLeft, widthRight]);
    useEffect(() => {
        const widthTotal = windowWidth
        setWidthTotal(widthTotal);
        const widthLeftLocal = widthTotal * widthLeftPercent;
        if (widthLeftLocal && (!isSplit || widthLeftPercent < 1)) {
            setWidthLeft(widthLeftLocal);
        }
        const widthRightLocal = widthTotal * widthRightPercent;
        if (isSplit && widthRightLocal) {
            setWidthRight(widthRightLocal);
        }
    }, [
        widthLeftPercent,
        widthRightPercent,
        isSplit,
        windowWidth
    ]);
    const onSplitResize = (event, { element, size, handle }) => {
        if (handle === "e") {
            setWidthRight(widthTotal - size.width);
            setWidthLeft(size.width);
        } else {
            setWidthLeft(widthTotal - size.width);
            setWidthRight(size.width);
        }
        setWidthLeftPercent(widthLeft / widthTotal);
        setWidthRightercent(widthRight / widthTotal);
    };
    const leftHandle = useMemo(()=> isSplit ? ['e'] : [], [isSplit])
    return (
        <ThemeProvider theme={theme}>
            <MainContainer>
                {!isEmbed && <StatusBar />}
                <div className="panels-container" ref={refTotal}>
                    <ResizableBox
                        width={isSplit ? widthLeft : PANEL_WIDTH}
                        minWidth={isSplit ? minWidth : PANEL_WIDTH}
                        maxWidth={isSplit ? maxWidth : PANEL_WIDTH}
                        minHeight={height}
                        maxHeight={height}
                        height={height}
                        axis={"x"}
                        resizeHandles={leftHandle}
                        lockAspectRatio={false}
                        onResize={onSplitResize}
                    >
                        <Panel 
                        width={widthLeft} name="left" />
                    </ResizableBox>
                    {isSplit && (
                        <ResizableBox
                            width={widthRight}
                            minWidth={minWidth}
                            maxWidth={maxWidth}
                            minHeight={height}
                            maxHeight={height}
                            height={height}
                            axis={"x"}
                            resizeHandles={rightHandle}
                            lockAspectRatio={false}
                            onResize={onSplitResize}
                        >
                            <Panel 
                            width={widthRight} name="right" />
                        </ResizableBox>
                    )}
                </div>
            </MainContainer>
            <SettingsDialog open={settingsDialogOpen} />
            <QueryHistory />
        </ThemeProvider>
    );
}

export default function Main() {
    UpdateStateFromQueryParams();
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 914px)" });
    const isAutoDark = useMediaQuery({query: "(prefers-color-scheme: dark)"});
    const dispatch = useDispatch();
    const isSplit = useSelector((store) => store.isSplit);
    const isEmbed = useSelector((store) => store.isEmbed);
    const theme = useSelector((store) => store.theme);
    const autoTheme = useSelector((store) => store.autoTheme);
    const settingsDialogOpen = useSelector((store) => store.settingsDialogOpen);
    const themeMemo = useMemo(() => themes[theme], [theme]);
    useEffect(()=>{
        if (autoTheme) {
            const theme = isAutoDark ? 'dark' : 'light';  
            dispatch(setTheme(theme));
        }
    },[isAutoDark, autoTheme, dispatch])
    if (!isTabletOrMobile) {
        // desktop view
        return (
            <DesktopView
                isEmbed={isEmbed}
                isSplit={isSplit}
                theme={themeMemo}
                settingsDialogOpen={settingsDialogOpen}
            />
        );
    } else {
        // mobile view
        return (
            <MobileView
                isEmbed={isEmbed}
                theme={themeMemo}
                settingsDialogOpen={settingsDialogOpen}
            />
        );
    }
}
