import { ThemeProvider } from "@emotion/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageContainer } from "./styles";
import { Route, Routes } from "react-router-dom";
import { DataSource } from "./DataSource";
import { List } from "./views/List";
import { DataSourcesFiller } from "./components/DataSourcesFiller";
import { setTheme } from "@ui/store/actions";
import { useMediaQuery } from "react-responsive";
import useTheme from "@ui/theme/useTheme"

export function getURlParams(params: any) {
    const url = params.replace(/#/, "");
    const decoded = decodeURIComponent(url);
    const urlParams = new URLSearchParams(decoded);
    let panels = { left: "", right: "" };
    for (let [key, val] of urlParams) {
        if (key === "left" || key === "right") {
            panels[key] = JSON.parse(val);
        }
    }
}

export default function DataSources() {
    const isAutoDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
    const dispatch: any = useDispatch();
    const theme = useTheme();
    const autoTheme = useSelector((store: any) => store.autoTheme);
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

    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                <div className="cont">
                    <List />

                    <div style={{ display: "flex", flex: 1 }}>
                        <div
                            style={{
                                height: "40px",
                            }}
                        >
                            <DataSourcesFiller />
                        </div>
                    </div>
                </div>
            </PageContainer>
            <Routes>
                <Route path=":id" element={<DataSource />} />
            </Routes>
        </ThemeProvider>
    );
}
