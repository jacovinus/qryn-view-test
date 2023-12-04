import { environment } from "@ui/environment/env.dev";
import setDebug from "./setDebug";
import moment from "moment";
import { nanoid } from "nanoid";
import DOMPurify from "isomorphic-dompurify";
const BOOLEAN_VALUES = ["isSubmit", "isSplit", "autoTheme", "isEmbed"];
export const initialUrlState: any = {
    query: "",
    queryType: "range",
    start: "",
    time: "",
    to: "",
    stop: "",
    from: "",
    left: [
        {
            id: nanoid(),
            idRef: "L-A",
            lastIdx: 1,
            panel: "left",
            queryType: "range",
            dataSourceType: "logs",
            dataSourceURL: "",
            dataSourceId: "cHI2SqPzH_kxYRXj",
            limit: 100,
            step: 5,
            tableView: false,
            chartView: false,
            isShowTs: true,
            isBuilder: false,
            isLogsVolume: false,
            browserOpen: false,
            expr: "",
            labels: [], // name: selected:
            values: [], // label name selected
            response: {}, // the target should be just the last one
            open: true,
            start: new Date(Date.now() - 5 * 60000),
            time: "", // for instant queries
            stop: new Date(Date.now()),
            label: "",
            pickerOpen: false, // time picker
        },
    ],

    right: [
        {
            id: nanoid(),
            idRef: "R-A",
            lastIdx: 1,
            panel: "right",
            queryType: "range",
            dataSourceType: "traces",
            dataSourceId: "32D16h5uYBqUUzhD",
            dataSourceURL: "",
            limit: 100,
            step: 5,
            tableView: false,
            chartView: false,
            isShowTs: true,
            isBuilder: false,
            isLogsVolume: false,
            browserOpen: false,
            expr: "",
            labels: [], // name: selected:
            values: [], // label name selected
            response: {}, // the target should be just the last one
            open: false,
            start: new Date(Date.now() - 5 * 60000),
            time: "", // for instant queries
            stop: new Date(Date.now()),
            label: "",
            pickerOpen: false, // time picker
        },
    ],

    label: "",
    limit: 100,
    step: 5,
    apiUrl: "",
    isSubmit: false,
    isEmbed: false,
    autoTheme: true,
    theme: "",
    isSplit: false,
};

export default function stateFromQueryParams() {
    const debug = setDebug(environment.environment);
    if (debug) console.group("🚧 LOGIC/InitialState/FromQuery");

    const { hash } = window.location;

    if (debug) console.log("🚧 LOGIC/FromQuery Hash", hash);

    const urlFromHash = new URLSearchParams(hash.replace(/#/, ""));

    if (debug) console.log("🚧 LOGIC/urlFromHash", urlFromHash, hash.length);

    if (hash.length > 0) {
        const startParams: any = { ...initialUrlState };
        if (debug)
            console.log("🚧 LOGIC/startParams/BeforeURLFromHash", startParams);
        for (let [key, value] of urlFromHash.entries()) {
            if (debug) console.log("🚧 LOGIC/startParams/", key, value);
            if (key === "stop" || key === "start") {
                const croppedTime =
                    parseInt(DOMPurify.sanitize(value)) / 1000000;
                startParams[key] = new Date(
                    (moment as any)(croppedTime).format(
                        "YYYY-MM-DDTHH:mm:ss.SSSZ"
                    )
                );
            } else if (key === "left" || key === "right") {

                let panel = decodeURIComponent(value);

                if (typeof panel === "string") {
                    try {
                        const parsedQuery = JSON.parse(
                            decodeURIComponent(
                              value || "[]"
                            )
                        );

                        startParams[key] = parsedQuery;

                    } catch (e) {
                        console.log(e);
                    }
                }
            } else if (BOOLEAN_VALUES.includes(key)) {
                try {
                    startParams[key] = JSON.parse(
                        DOMPurify.sanitize(value || "false")
                    );
                } catch (e) {
                    console.error(key);
                    startParams[key] = false;
                }
            } else {
                startParams[key] = value;
            }
            if (startParams.theme) {
                localStorage.setItem(
                    "theme",
                    DOMPurify.sanitize(
                        JSON.stringify({
                            theme: startParams.theme,
                            auto: !!startParams.autoTheme,
                        })
                    )
                );
            }
        }

        return startParams || initialUrlState;
    } else {
        if (debug) console.groupEnd();
        return initialUrlState;
    }
}
