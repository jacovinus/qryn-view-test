/**React */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
/**npm */
import {  cx } from "@emotion/css";
import { ThemeProvider } from "@emotion/react";
import { useMediaQuery } from "react-responsive";
import { Switch } from "@mui/material";
import { MobileTopQueryMenuCont } from "./MobileTopQueryMenuCont";
import { QueryBarCont } from "./QueryBarCont";
import getData from "@ui/store/actions/getData";
import setQueryHistory from "@ui/store/actions/setQueryHistory";
import setHistoryOpen from "@ui/store/actions/setHistoryOpen";
import setLinksHistory from "@ui/store/actions/setLinksHistory";
import setIsEmptyView from "@ui/store/actions/setIsEmptyView";
import { setDataSources, setSplitView } from "@ui/store/actions";
import localService from "../../services/localService";
import localUrl from "../../services/localUrl";
import ShowLogsButton from "../../qryn-ui/Buttons/ShowLogsButton";
import ShowLogsRateButton from "../../qryn-ui/Buttons/ShowLogsRateButton";
import queryInit, { onQueryValid, panelAction } from "./helpers";
import QueryOptions from "./QueryOptions";
import { QuerySetting } from "./QuerySetting";
import { defaultDataSources } from "../../views/DataSources/store/defaults";
import TracesSearch from "@ui/main/components/TraceSearch/TraceSearch";
import TracesSwitch from "@ui/main/components/TraceSearch/TracesSwitch";
import { maxWidth, SettingLabel } from "./styles";
import MetricsSearch from "@ui/main/components/DataViews/components/Metrics/MetricsSearch";
import useTheme from "@ui/theme/useTheme";
import LogsSearch from "@ui/main/components/DataViews/components/Logs/LogsSearch/LogsSearch";
import sanitizeWithSigns from "../../helpers/sanitizeWithSigns";

/**
 *
 * @param props
 * @returns The Main Query bar component
 */
export const QueryBar = (props: any) => {
    const { data, name, width } = props;
    const {
        queryType,
        limit,
        id,
        dataSourceType,
        direction,
        dataSourceId,
        splitted,
        //  dataSourceURL,
    } = data;
    const {
        data: {
            loading,
            hasStats,
            isShowStats,
            isBuilder,
            isLogsVolume,
            logsVolumeQuery,
        },
    } = props;

    const { hash } = useLocation();
    const dispatch: any = useDispatch();
    const saveUrl = localUrl();
    const historyService = localService().historyStore();
    const theme = useTheme();
    const { historyOpen, isEmbed, queryHistory, start, stop } = useSelector(
        (store: any) => store
    );
    const isSplit = useSelector((store: any) => store.isSplit);
    const panelQuery = useSelector((store: any) => store[name]);
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1070px)" });
    const [queryInput, setQueryInput] = useState<any>(data.expr);
    const [queryValid, setQueryValid] = useState<any>(false);
    const [queryValue, setQueryValue] = useState<any>(queryInit(data.expr));
    const [traceQueryType, setTraceQueryType] = useState<any>("traceId");
    const [labels] = useState<any>([]);
    // eslint-disable-next-line
    const [traceSearch, setTraceSearch] = useState<any>({});
    const [showStatsOpen, setShowStatsOpen] = useState<any>(
        isShowStats || false
    );
    const [open, setOpen] = useState<any>(false);
    // const [currentDataSource,setCurrentDatasource] = useState({})
    const dataSources = useSelector((store: any) => store.dataSources);
    const panelData = useSelector((store: any) => store[name]);
    const actLocalQuery = useMemo(() => {
        let exprQuery = { expr: "", dataSourceId, queryId: id };
        try {
            const localData =
                JSON.parse(localStorage.getItem("queryData") || "[]") || [];
            if (localData && localData?.length > 0) {
                const fromLocal = localData?.find(
                    (f: any) =>
                        f.dataSourceId === dataSourceId && f.queryId === id
                );
                if (fromLocal) {
                    exprQuery = { ...fromLocal };
                }
                return exprQuery;
            } else {
                return exprQuery;
            }
        } catch (e) {
            console.error(e);
            return exprQuery;
        }
       
    }, [dataSourceId]);

    const actLocalDs = useMemo(() => {
        try {
            const localData = JSON.parse(
                localStorage.getItem("dataSources") || "[]"
            );
            return localData?.find((f: any) => f.id === dataSourceId);
        } catch (e) {
            return {};
        }
    }, [dataSourceId]);

    const expr = useMemo(() => {
        return data.expr;
    }, [data.expr]);

    const initialDefault = useMemo(() => {
        return defaultDataSources.find((f: any) => f.id === dataSourceId);
    }, [dataSourceId]);

    // on init

    const findCurrentDataSource = (dataSources: any, id: string) => {
        return dataSources?.find((f: any) => f.id === dataSourceId);
    };



    useEffect(() => {
        setQueryInput(actLocalQuery.expr);
        setQueryValue([
            { children: [{ text: sanitizeWithSigns(actLocalQuery.expr) }] },
        ]);

        setLogsLevel(actLocalQuery.expr, isLogsVolume);

        const dataSource: any = findCurrentDataSource(dataSources, id);

        let currentDataSource: any = {};

        if (
            actLocalDs &&
            actLocalDs?.url !== initialDefault &&
            actLocalDs?.url !== ""
        ) {
            currentDataSource = { ...actLocalDs };

            const panelCP = [...panelData];

            panelCP.forEach((query) => {
                if (query.id === id) {
                    query.dataSourceId = currentDataSource.id;
                    query.dataSourceType = currentDataSource.type;
                    query.dataSourceURL = currentDataSource.url;
                }
            });

            dispatch(panelAction(name, panelCP));

            const dsCopy = [...dataSources];
            dsCopy.forEach((ds) => {
                if (ds.id === dataSourceId) {
                    ds = currentDataSource;
                }
            });

            dispatch(setDataSources(dsCopy));
        } else if (dataSource && dataSource.url !== "") {
            currentDataSource = { ...dataSource };
        }

        if (isEmbed)
            dispatch(
                getData(
                    dataSourceType,
                    queryInput,
                    queryType,
                    limit,
                    name,
                    id,
                    direction,
                    dataSourceId,
                    currentDataSource?.url
                )
            );
       
    }, []);

    // force single view from small width

    useEffect(() => {
        if (isTabletOrMobile && isSplit) {
            dispatch(setSplitView(false));
        }
        if(!isTabletOrMobile && isSplit) {
            dispatch(setSplitView(true))
        }
       
    }, [isTabletOrMobile]);

    // changes on changin dataSource Id

    useEffect(() => {
        setQueryInput(actLocalQuery.expr);
        setQueryValue([
            { children: [{ text: sanitizeWithSigns(actLocalQuery.expr) }] },
        ]);
        if (isLogsVolume && logsVolumeQuery) {
            setLogsLevel(actLocalQuery.expr, isLogsVolume);
        }
        const dataSource: any = dataSources?.find(
            (f: any) => f.id === dataSourceId
        );

        let currentDataSource: any = {};

        if (
            actLocalDs &&
            actLocalDs?.url !== initialDefault &&
            actLocalDs?.url !== ""
        ) {
            currentDataSource = { ...actLocalDs };

            const panelCP = [...panelData];

            panelCP.forEach((query) => {
                if (query.id === id) {
                    query.dataSourceId = currentDataSource.id;
                    query.dataSourceType = currentDataSource.type;
                    query.dataSourceURL = currentDataSource.url;
                }
            });

            dispatch(panelAction(name, panelCP));

            const dsCopy = [...dataSources];
            dsCopy.forEach((ds) => {
                if (ds.id === dataSourceId) {
                    ds = currentDataSource;
                }
            });

            dispatch(setDataSources(dsCopy));
        } else if (dataSource && dataSource.url !== "") {
            currentDataSource = { ...dataSource };
        }

        let { isMatrix } = getIntvalData(actLocalQuery?.expr);
        if (actLocalQuery.expr !== "" && actLocalQuery.expr?.length > 6) {
            dispatch(
                getData(
                    dataSourceType,
                    actLocalQuery?.expr,
                    queryType,
                    limit,
                    name,
                    id,
                    direction,
                    dataSourceId,
                    currentDataSource?.url
                )
            );
        }

        // setLogsLevel(queryInput, isLogsVolume);
        if (
            isLogsVolume &&
            logsVolumeQuery?.query &&
            logsVolumeQuery?.query !== "" &&
            dataSourceType === "logs" &&
            !isMatrix
        ) {
            dispatch(
                getData(
                    dataSourceType,
                    logsVolumeQuery.query,
                    queryType,
                    limit,
                    name,
                    id,
                    direction,
                    dataSourceId,
                    currentDataSource.url,
                    logsVolumeQuery.customStep,
                    true // isLogsVolume
                )
            );
        }
       
    }, [dataSourceId, id]);

    // changes on changing exp

    useEffect(() => {
        if (typeof expr === "string") {
            setQueryInput(expr);
            setQueryValue([{ children: [{ text: sanitizeWithSigns(expr) }] }]);
            saveQuery();
            if (isLogsVolume) {
                setLogsLevel(expr, true);
            }
        }
       
    }, [expr]);

    useEffect(()=>{
        if(typeof props.launchQuery === "string") {
            setQueryInput(props.launchQuery);
            setQueryValue([
                { children: [{ text: sanitizeWithSigns(props.launchQuery) }] },
            ]);
            saveQuery();
            if (isLogsVolume) {
                setLogsLevel(props.launchQuery, true);
            }
    
        }

       // setLogsLevel(launchQuery, isLogsVolume);


    },[props.launchQuery])

    useEffect(() => {
        setLogsLevel(queryInput, isLogsVolume);
       
    }, [queryInput]);

    // handlers

    function setLogsLevel(queryInput: string, isLogsVolume: boolean) {
        if (isLogsVolume && queryInput !== "") {
            // eslint-disable-next-line
            let pureLabels = queryInput.match(/[^{\}]+(?=})/g);
            if (Array.isArray(pureLabels) && pureLabels?.length > 0) {
                let pureLabelsString = `{${pureLabels?.join(",")}}`;
                let logsVolumeQuery = `sum by(level) (count_over_time(${pureLabelsString}[$__interval]))`;
                onLogVolumeChange(logsVolumeQuery);
            }
        }
    }

    function handleQueryChange(e: any) {
        setQueryValue(e);
        saveQuery(e);
    }

    const handleInputKeyDown = (e: any) => {
        if (e.code === "Enter" && e.ctrlKey) {
            onSubmit(e);
        }
    };

    const onMetricChange = (e: any) => {
        const query = [{ children: [{ text: sanitizeWithSigns(e) }] }];
        handleQueryChange(query);
    };

    const onLogChange = (e: any) => {
        const query = [{ children: [{ text: sanitizeWithSigns(e) }] }];

        // at this scope we should do the query change from the
        //  'use query' button

        handleQueryChange(query);
    };

    const setQueryTimeInterval = (
        query: string,
        width: number,
        start: Date | any,
        stop: Date | any
    ) => {
        let querySubmit = "";

        let customStep = 0;

        if (query.includes(`$__interval`)) {
            const timeDiff = (stop.getTime() - start.getTime()) / 1000;

            const timeProportion = timeDiff / 30;

            const screenProportion = Number(
                (width / window.innerWidth).toFixed(1)
            );

            const intval = timeProportion / screenProportion;

            const ratiointval = Math.round(
                intval * Number(window.devicePixelRatio.toFixed(2))
            );

            querySubmit = query.replace(
                /\[\$__interval\]/,
                `[${ratiointval}s]`
            );
            customStep = ratiointval;
        } else {
            querySubmit = query;
        }
        return { query: querySubmit, customStep };
    };

    const onLogVolumeChange = (queryString: string) => {
        const { query, customStep } = setQueryTimeInterval(
            queryString,
            width,
            start,
            stop
        );
        saveLogsVolumeQuery({ query, customStep });
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        const ds: any = dataSources.find((f: any) => f.id === dataSourceId);
        if (onQueryValid(queryInput) && ds) {
            try {
                updateHistory(
                    ds.type,
                    queryInput,
                    queryType,
                    limit,
                    id,
                    direction,
                    ds.id,
                    ds.url
                );

                if (isLogsVolume && !logsVolumeQuery) {
                    setLogsLevel(queryInput, isLogsVolume);
                }

                // Decode query to translate into labels selection
                decodeQueryAndUpdatePanel(queryInput, true);

                updateLinksHistory();

                setLocalStorage();
            } catch (e) {
                console.error(e);
            }
        } else {
            dispatch(setIsEmptyView(true));

            console.log("Please make a log query", expr);
        }
    };

    const getLocalStorage = () => {
        try {
            const prevQuery = JSON.parse(
                localStorage.getItem("queryData") || "[]"
            );
            return prevQuery;
        } catch (e) {
            return [];
        }
    };

    const setLocalStorage = () => {
        const queryData = {
            expr,
            queryId: id,
            dataSourceId: dataSourceId,
        };

        const prevData = getLocalStorage();
        let newData = [];

        if (
            prevData &&
            prevData.length > 0 &&
            Array.isArray(prevData) &&
            prevData.some(
                (s) => s.dataSourceId === dataSourceId && s.queryId === id
            )
        ) {
            newData = prevData.map((m) => {
                if (m.queryId === id && m.dataSourceId === dataSourceId) {
                    return { ...queryData };
                } else {
                    return m;
                }
            });
        } else {
            newData = [...prevData, queryData];
        }
        localStorage.setItem("queryData", JSON.stringify(newData));
    };

    const saveQuery = (e = []) => {
        if (e?.length > 0) {
            const queryParams = new URLSearchParams(hash.replace(/#/, ""));
            const multiline = e
                ?.map((text: any) => text.children[0].text)
                .join("\n");
            const panel = [...panelQuery];
            panel.forEach((query) => {
                if (query.id === id) {
                    if (multiline) {

                        query.expr = multiline;
                    }
                }
            });
            dispatch(panelAction(name, panel));
            queryParams.set(name, JSON.stringify(panel));
            setLocalStorage();
        }
    };

    const saveLogsVolumeQuery = (logsVolume: {
        query: string;
        customStep: any;
    }) => {
        const panel = [...panelQuery];
        panel.forEach((query) => {
            if (query.id === id) {
                if (logsVolume && logsVolume.query !== "") {
                    query.logsVolumeQuery = {
                        query: logsVolume.query,
                        customStep: logsVolume.customStep,
                    };
                }
            }
        });
        dispatch(panelAction(name, panel));
    };

    function addQueryInterval(queryInput: string) {
        const isEmptyQuery = queryInput.length === 0;
        let query = "";
        if (!isEmptyQuery) {
            const isRate = queryInput.startsWith("rate(");

            if (dataSourceType === "metrics") {
                if (isRate) {
                    query = queryInput.replace(/{([^}]+)}/g, "{}");
                    query = query.replace(/\[\d+ms\]/, "[$__interval]");
                } else {
                    query = `rate(${queryInput.replace(
                        /{([^}]+)}/g,
                        "{}"
                    )}[$__interval])`;
                }
            } else {
                if (!isRate) {
                    query = `rate(${queryInput}[$__interval])`;
                } else {
                    query = queryInput.replace(/\[\d+ms\]/, "[$__interval]");
                }
            }
        }
        return query;
    }

    const onSubmitRate = (e: any) => {
        e.preventDefault();
        const isEmptyQuery = queryInput.length === 0;
        let query = "";
        // check how to update back the query preview
        if (!isEmptyQuery) {
            query = addQueryInterval(queryInput);
            setQueryInput(query);
            setQueryValue([
                { children: [{ text: sanitizeWithSigns(query) }] },
            ]);
            setQueryValid(onQueryValid(query));
        }

        if (onQueryValid(query)) {
            tryUpdateHistory(query);
        }
    };

    function tryUpdateHistory(query: string) {
        const ds = dataSources.find((f: any) => f.id === dataSourceId);
        try {
            updateHistory(
                ds.type,
                query,
                queryType,
                limit,
                id,
                direction,
                ds.id,
                ds.url
            );
            updateLinksHistory();
        } catch (e) {
            console.error(e);
        }
    }

    const updateHistory = (
        type: any,
        queryInput: any,
        queryType: any,
        limit: any,
        id: any,
        direction: any,
        dataSourceId: any,
        url: any
    ) => {
        const historyUpdated = historyService.add(
            {
                data: JSON.stringify({
                    type,
                    queryInput,
                    queryType,
                    limit,
                    direction,
                    dataSourceId: dataSourceId,
                    url,
                    panel: name,
                    id,
                }),
                url: window.location.hash,
            },
            10
        );

        dispatch(setQueryHistory(historyUpdated));
    };

    const decodeQueryAndUpdatePanel = (queryExpr: any, isSearch: any) => {
        const currentDataSource = dataSources.find(
            (f: any) => f.id === dataSourceId
        );
        const panel = [...panelQuery];

        dispatch(panelAction(name, panel));

        let { querySubmit, customStep, isMatrix } = getIntvalData(queryExpr);

        if (isSearch && querySubmit !== "" && querySubmit?.length > 6) {
            dispatch(
                getData(
                    dataSourceType,
                    querySubmit,
                    queryType,
                    limit,
                    name,
                    id,
                    direction,
                    dataSourceId,
                    currentDataSource.url,
                    customStep,
                    isLogsVolume && !isMatrix
                )
            );
        }

        // get here if the previous is a matrix type response
        if (
            isLogsVolume &&
            logsVolumeQuery?.query &&
            logsVolumeQuery?.query !== "" &&
            !isMatrix
        ) {
            dispatch(
                getData(
                    dataSourceType,
                    logsVolumeQuery.query,
                    queryType,
                    limit,
                    name,
                    id,
                    direction,
                    dataSourceId,
                    currentDataSource.url,
                    logsVolumeQuery.customStep,
                    true // isLogsVolume
                )
            );
        }
    };

    function getIntvalData(queryExpr: string): {
        customStep: number;
        querySubmit: string;
        isMatrix: boolean;
    } {
        let querySubmit = "";
        let customStep = 0;
        let isMatrix = false;
        let matrixType = queryExpr.match(/\((.*?)\)/);
        if (matrixType !== null) {
            isMatrix = true;
        }

        if (queryExpr.includes("$__interval")) {
            isMatrix = true;
            const timeDiff = (stop.getTime() - start.getTime()) / 1000;
            const timeProportion = timeDiff / 30;
            const screenProportion = Number(
                (width / window.innerWidth).toFixed(1)
            );
            const intval = timeProportion / screenProportion;

            const ratiointval = Math.round(
                intval * Number(window.devicePixelRatio.toFixed(2))
            );
            querySubmit = queryExpr.replace(
                /\[\$__interval\]/,
                `[${ratiointval}s]`
            );
            customStep = ratiointval;
        } else {
            querySubmit = queryExpr;
        }

        return { customStep, querySubmit, isMatrix };
    }

    const updateLinksHistory = () => {
        const ds = dataSources.find((f: any) => f.id === dataSourceId);
        const storedUrl = saveUrl.add(
            {
                data: {
                    href: window.location.href,
                    url: ds.url,
                    type: dataSourceType,
                    queryInput,
                    queryType,
                    limit,
                    panel: name,
                    id,
                },
                description: "From Query Submit",
            },
            10
        );

        dispatch(setLinksHistory(storedUrl));
    };

    function handleHistoryClick(e: any) {
        dispatch(setHistoryOpen(!historyOpen));
    }

    function showQuerySettings() {
        setOpen(open ? false : true);
    }

    function onClose() {
        showQuerySettings();
    }

    function onTraceSearchChange(e: any) {
        setTraceSearch(() => e);
    }

    function handleStatsOpen(e: any) {
        const value = e.target.checked;
        setShowStatsOpen(() => value);
        const prevPanel = JSON.parse(JSON.stringify(panelData));

        const newPanel = prevPanel?.map((m: any) => {
            if (m.id === id) {
                return { ...m, isShowStats: value };
            }
            return m;
        });

        dispatch(panelAction(name, newPanel));
    }

    const switchTraceQueryType = (e: any) => {
        setTraceQueryType(() => e);
    };

    // renderers

    const inlineQueryOptionsRenderer = (
        type: any,
        isSplit: any,
        isMobile: any,
        typeBar: any
    ) => {
        const isFullView = !isMobile && !isSplit;
        const isMetrics = type === "metrics" || type === "logs";

        if (isFullView && isMetrics && !isSplit) {
            return typeBar;
        }
        return null;
    };

    const querySettingRenderer = (
        isMobile: any,
        isSplit: any,
        dataSourceType: any,
        settingComp: any
    ) => {
        if (
            isMobile ||
            isSplit ||
            dataSourceType !== "flux" ||
            dataSourceType !== "traces"
        ) {
            return settingComp;
        }
        return null;
    };

    if (isEmbed) {
        return null;
    }

    const queryTypeRenderer = (
        type: any,
        traceSearch: any,
        querySearch: any,
        metricsSearch: any,
        logsSearch: any,
        showResultButton: any
    ) => {
        if (type === "traces") {
            return (
                <>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingRight: "15px",
                        }}
                    >
                        <TracesSwitch
                            value="traceId"
                            onChange={switchTraceQueryType}
                        />
                        {traceQueryType === "traceId" && showResultButton}
                    </div>
                    {traceQueryType === "traceId" && querySearch}
                    {traceQueryType === "search" && traceSearch}
                </>
            );
        }

        if (type === "metrics") {
            return (
                <>
                    {metricsSearch}
                    {querySearch}
                </>
            );
        }

        if (type === "logs") {
            return (
                <>
                    {isBuilder && logsSearch}
                    {querySearch}
                </>
            );
        }

        return querySearch;
    };

    // render
    if (isEmbed) {
        return null;
    }

    return (
        <div className={cx(maxWidth)} id={id}>
            <ThemeProvider theme={theme}>
                { (dataSourceType !== "metrics" &&
                    dataSourceType !== "traces") && (
                        <MobileTopQueryMenuCont
                            {...props}
                            isSplit={splitted}
                            dataSourceType={dataSourceType}
                            showQuerySettings={showQuerySettings}
                            queryHistory={queryHistory}
                            handleHistoryClick={handleHistoryClick}
                            queryValid={queryValid}
                            onSubmit={onSubmit}
                            onSubmitRate={onSubmitRate}
                            labels={labels}
                            loading={loading || false}
                            hasStats={hasStats}
                            showStatsOpen={showStatsOpen}
                            handleStatsOpen={handleStatsOpen}
                        />
                    )}

                {queryTypeRenderer(
                    dataSourceType,
                    <TracesSearch
                        {...props}
                        onSearchChange={onTraceSearchChange}
                    />,
                    <QueryBarCont
                        {...props}
                        isSplit={splitted}
                        isBuilder={isBuilder}
                        dataSourceType={dataSourceType}
                        handleQueryChange={handleQueryChange}
                        expr={expr}
                        queryValue={queryValue}
                        handleInputKeyDown={handleInputKeyDown}
                        queryHistory={queryHistory}
                        handleHistoryClick={handleHistoryClick}
                        queryValid={queryValid}
                        onSubmit={onSubmit}
                        onSubmitRate={onSubmitRate}
                        isTabletOrMobile={isTabletOrMobile}
                        labels={labels}
                        loading={loading || false}
                    />,
                    <MetricsSearch
                        {...props}
                        queryInput={queryInput}
                        searchButton={
                            <ShowLogsButton
                                disabled={!queryValid}
                                loading={loading || false}
                                onClick={onSubmit}
                                isMobile={false}
                                alterText={"Use Query"}
                            />
                        }
                        logsRateButton={
                            <ShowLogsRateButton
                                disabled={!queryValid}
                                onClick={onSubmitRate}
                                isMobile={false}
                                alterText={"Use as Rate Query"}
                            />
                        }
                        statsSwitch={
                            <div className="options-input">
                                <SettingLabel>Show Stats</SettingLabel>
                                <Switch
                                    checked={showStatsOpen}
                                    size={"small"}
                                    onChange={handleStatsOpen}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </div>
                        }
                        handleMetricValueChange={onMetricChange}
                    />,
                    <LogsSearch
                        {...props}
                        queryInput={queryInput}
                        isBuilder={isBuilder}
                        searchButton={
                            <ShowLogsButton
                                disabled={!queryValid}
                                loading={loading || false}
                                onClick={onSubmit}
                                isMobile={false}
                                alterText={"Use Query"}
                            />
                        }
                        logsRateButton={
                            <ShowLogsRateButton
                                disabled={!queryValid}
                                onClick={onSubmitRate}
                                isMobile={false}
                                alterText={"Use as Rate Query"}
                            />
                        }
                        statsSwitch={
                            <div className="options-input">
                                <SettingLabel>Show Stats</SettingLabel>
                                <Switch
                                    checked={showStatsOpen}
                                    size={"small"}
                                    onChange={handleStatsOpen}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </div>
                        }
                        handleLogValueChange={onLogChange}
                        handleLogsVolumeChange={onLogVolumeChange}
                    />,
                    <ShowLogsButton
                        disabled={!queryValid}
                        onClick={onSubmit}
                        loading={loading || false}
                        isMobile={false}
                        alterText={"Search Trace"}
                    />
                )}

                {inlineQueryOptionsRenderer(
                    dataSourceType,
                    splitted,
                    isTabletOrMobile,
                    <QueryOptions {...props} />
                )}

                {querySettingRenderer(
                    isTabletOrMobile,
                    splitted,
                    dataSourceType,
                    <QuerySetting
                        {...props}
                        open={open}
                        handleClose={onClose}
                        actPanel={panelQuery}
                        name={name}
                    />
                )}
            </ThemeProvider>
        </div>
    );
};
