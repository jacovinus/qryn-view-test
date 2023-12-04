import getTimeParams from "./getTimeParams";
import { QueryDirection, QueryResult, QueryType, TracesResult } from "../types";
import store  from "@ui/store/store";
import setIsEmptyView from "../setIsEmptyView";
import { parseResponse } from "./parseResponse";
import { resetNoData } from "./resetNoData";
import setResponseType from "../setResponseType";
import { convertFlux } from "./convertFlux";
import { setLeftPanel } from "../setLeftPanel";
import { setRightPanel } from "../setRightPanel";

export function setPanelData(panel: string, data: any) {
    if (panel === "left") {
        return setLeftPanel(data);
    } else {
        return setRightPanel(data);
    }
}

export const resetTraceData = (
    type: string,
    dispatch: Function,
    panel: string,
    id: string,
    direction: QueryDirection,
    queryType: QueryType
) => {
    const { time } = getTimeParams(type, id, panel);
    const { debugMode } = store.getState();

    const resultQuery: TracesResult = {
        result: { resourceSpans: [], result: [], length: 0 },
        raw: [],
        time,
        debugMode,
        dispatch,
        type: "traces",
        dsType: type,
        panel,
        id,
        ts: Date.now(),
        queryType,
        open:true
    };
    parseResponse(resultQuery);
};
export async function processResponse(
    type: string,
    response: any,
    dispatch: Function,
    panel: string,
    id: string,
    direction: QueryDirection,
    queryType: QueryType,
    isLogsVolume?: boolean
) {
    const { time } = getTimeParams(type, id, panel);
    const { debugMode } = store.getState();
    if (type === "traces") {
        if (
            queryType === "trace-search" &&
            response?.data?.traces?.length > 0
        ) {
            const resultQuery: TracesResult = {
                result: response.data.traces || [],
                raw: response.data,
                time,
                debugMode,
                dispatch,
                dsType: type,
                type,
                panel,
                open:true,
                id,
                ts: Date.now(),
                queryType,
            };
            parseResponse(resultQuery);
        }

        if (response?.data?.resourceSpans?.length > 0) {
            const resultQuery: TracesResult = {
                result: response?.data || [],
                raw: response?.data,
                time,
                debugMode,
                dispatch,
                type,
                dsType: type,
                panel,
                open:true,
                id,
                ts: Date.now(),
                queryType,
            };
            parseResponse(resultQuery);
        }
    }
    if (type === "flux") {
        await convertFlux(response?.data).then((data) => {
            if (data?.data?.length > 0) {
                const resultQuery: QueryResult = {
                    result: data.data || [],
                    raw: data?.data,
                    time,
                    debugMode,
                    queryType,
                    dispatch,
                    dsType: type,
                    type,
                    panel,
                    open:true,
                    id,
                    ts: Date.now(),
                    direction,
                };

                parseResponse(resultQuery);
            }
        });
    }

    if (response?.data?.streams?.length === 0) {
        const resultQuery: QueryResult = {
            result: [],
            raw: "[]",
            time,
            debugMode,
            queryType,
            dispatch,
            open:true,
            type: "streams",
            dsType: type,
            panel,
            id,
            ts: Date.now(),
            direction,
            isLogsVolume,
        };

        parseResponse(resultQuery);
        dispatch(setIsEmptyView(true));
    }

    // empty response would respond as data.data = {streams:[]}
    if (response?.data?.data) {
        const result = response?.data?.data?.result;
        const rtype = response?.data?.data?.resultType;
        let statsInfo = { hasStats: false, statsData: {} };
        if (
            response?.data?.data?.stats &&
            Object.keys(response?.data?.data?.stats)?.length > 0
        ) {
            statsInfo = {
                hasStats: true,
                statsData: { ...response?.data?.data?.stats },
            };
        }

        const actPanel = store.getState()[panel];

        const newPanel = actPanel?.map((m: any) => {
            if (m.id === id) {
                return {
                    ...m,
                    hasStats: statsInfo?.hasStats || false,
                    statsData: statsInfo?.statsData || {},
                    open:true,
                };
            }
            return m;
        });
        dispatch(setPanelData(panel, newPanel));

        dispatch(setResponseType(type));

        const resultQuery: QueryResult = {
            result,
            raw: response?.data?.data,
            time,
            debugMode,
            queryType,
            dispatch,
            type: rtype,
            dsType: type,
            open:true,
            panel,
            id,
            ts: Date.now(),
            direction,
            isLogsVolume,
        };
        parseResponse(resultQuery);
    } else {
        resetNoData(dispatch);
    }
}
