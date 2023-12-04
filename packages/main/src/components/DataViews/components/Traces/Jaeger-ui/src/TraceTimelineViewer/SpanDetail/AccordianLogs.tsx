// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { css } from "@emotion/css";
import { sortBy as _sortBy } from "lodash";
import React from 'react';
import IoIosArrowDown from "@mui/icons-material/KeyboardArrowDown";
import IoIosArrowRight from "@mui/icons-material/ArrowForwardIos";
import { TNil } from "../../types";
import { TraceLog, TraceKeyValuePair, TraceLink } from "../../types/trace";
import { uAlignIcon, ubMb1 } from "../../uberUtilityStyles";
import { formatDuration } from "../utils";

import AccordianKeyValues from "./AccordianKeyValues";
import styled from "@emotion/styled";
const AccordianLogsStyled = styled.div`
   // border: 1px solid #d8d8d8;
    position: relative;
    margin-bottom: 0.25rem;
`;
const AccordianLogsFooter = styled.small`
//    color: #999;
    font-size: 80%;
`;
const AccordianLogsContent = styled.div`
  //  background: #f0f0f0;
 //   border-top: 1px solid #d8d8d8;
  //  padding: 0.5rem 0.5rem 0.25rem 0.5rem;
`;
const AccordianLogsHeader = css`
    display: flex;
    align-items: center;
  //  background: #e4e4e4;
    color: inherit;
   
    font-size: 12px;
    padding: 0.25rem 0.5rem;
    &:hover {
   //     background: #dadada;
    }
`;

type AccordianLogsProps = {
    interactive?: boolean;
    isOpen: boolean;
    linksGetter:
        | ((pairs: TraceKeyValuePair[], index: number) => TraceLink[])
        | TNil;
    logs: TraceLog[];
    onItemToggle?: (log: TraceLog) => void;
    onToggle?: () => void;
    openedItems?: Set<TraceLog>;
    timestamp: number;
};

export default function AccordianLogs(props: AccordianLogsProps) {
    const {
        interactive,
        isOpen,
        linksGetter,
        logs,
        openedItems,
        onItemToggle,
        onToggle,
        timestamp,
    } = props;
    let arrow: React.ReactNode | null = null;
    let HeaderComponent: "span" | "a" = "span";
    let headerProps: {} | null = null;
    if (interactive) {
        arrow = isOpen ? (
            <IoIosArrowDown
                style={{ height: "13px", width: "12px" }}
                className={uAlignIcon}
            />
        ) : (
            <IoIosArrowRight
                style={{ height: "13px", width: "12px" }}
                className={uAlignIcon}
            />
        );
        HeaderComponent = "a";
        headerProps = {
            "aria-checked": isOpen,
            onClick: onToggle,
            role: "switch",
        };
    }
    const logsMemo = React.useMemo(() => {
        return logs.map((t: any) => {
            const fields = Object.keys(t)?.filter((f) => f !== "timeUnixNano");
            return {
                timestamp: parseInt(t.timeUnixNano) / 1000,
                fields: fields.map((m) => ({ key: m, value: t[m] })),
            };
        });
    }, [logs]);
    //   const styles = useStyles2(getStyles);
    return (
        <AccordianLogsStyled>
            <HeaderComponent className={AccordianLogsHeader} {...headerProps}>
                {arrow} <strong>Events ({logsMemo.length})</strong> 
            </HeaderComponent>
            {isOpen && (
                <AccordianLogsContent>
                    {_sortBy(logsMemo, "timestamp").map((log, i) => (
                        <AccordianKeyValues
                            // `i` is necessary in the key because timestamps can repeat
                            key={`${log.timestamp}-${i}`}
                            className={i < logsMemo.length - 1 ? ubMb1 : null}
                            data={log.fields || []}
                            highContrast
                            interactive={interactive}
                            isOpen={openedItems ? openedItems.has(log) : false}
                            label={`${formatDuration(
                                log.timestamp - timestamp
                            )}`}
                            linksGetter={linksGetter}
                            onToggle={
                                interactive && onItemToggle
                                    ? () => onItemToggle(log)
                                    : null
                            }
                        />
                    ))}
                    <AccordianLogsFooter>
                        Log timestamps are relative to the start time of the
                        full trace.
                    </AccordianLogsFooter>
                </AccordianLogsContent>
            )}
        </AccordianLogsStyled>
    );
}

AccordianLogs.defaultProps = {
    interactive: true,
    linksGetter: undefined,
    onItemToggle: undefined,
    onToggle: undefined,
    openedItems: undefined,
};
