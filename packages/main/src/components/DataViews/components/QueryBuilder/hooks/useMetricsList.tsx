import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { getHeaders } from "../helpers";

export function useMetricsList(id: string, value: string) {
    const dataSources = useSelector((store: any) => store.dataSources);
    const start = useSelector((store: any) => store.start);
    const stop = useSelector((store: any) => store.stop);

    const timeParams = useMemo(() => {
        return {
            start: moment(start).unix(),
            end: moment(stop).unix(),
        };
    }, [start, stop]);

    const [metricNames, setMetricNames] = useState([]);

    const dataSource = useMemo(() => {
        return dataSources.find((f:any) => f.id === id);
    }, [dataSources, id]);

    const valueFormatter = useMemo(() => {
        const val = encodeURIComponent(`{__name__="${value}"}`);
        const paren = "[]";
        const param = `match${encodeURIComponent(paren)}`;

        if (value) {
            return `${param}=${val}`;
        }
    }, [value]);

    useEffect(() => {
        if (
            dataSource.type === "metrics" &&
            dataSource?.url &&
            dataSource?.url !== "" &&
            value &&
            value !== ""
        ) {
            const metricsHeaders = getHeaders(dataSource);

            const url = `${dataSource.url}/api/v1/series?start=${timeParams.start}&end=${timeParams.end}&${valueFormatter}`;
            const apiRequest = async () => {
                try {
                    const req = await axios.get(url, metricsHeaders);
                    if (req?.status === 200) {
                        setMetricNames(req?.data?.data || []);
                    }
                } catch (e) {
                    console.log("Error at loading Span Names", e);
                }
            };

            apiRequest();
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource, timeParams.end, timeParams.start, valueFormatter]);

    return useMemo(() => {
        if (metricNames?.length > 0) {
            const metricsCP = [...metricNames];
            let metricSelect: any = {};
            metricsCP.forEach((metric) => {
                const metricKeys = Object.keys(metric);
                metricKeys.forEach((metricKey) => {
                    if (
                        !metricSelect[metricKey]?.some(
                            (s:any) => s === metric[metricKey]
                        )
                    ) {
                        metricSelect[metricKey] = [
                            ...(metricSelect[metricKey] || []),
                            metric[metricKey],
                        ];
                    }
                });
            });

            return metricSelect;
        }
        return {};
    }, [metricNames]);
}
