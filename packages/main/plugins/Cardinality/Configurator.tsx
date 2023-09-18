import { cx } from "@emotion/css";
import React from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { Totals } from "./Totals";
import DayPicker from "./DayPicker";
import { useTheme } from "@emotion/react";
import useConfigurator from "./useConfigurator";
import CardinalityInput from "./CardinalityInput";
import { ConfigContainerStyles } from "./ConfigContainerStyles";


type ConfiguratorProps = {
    theme: any;
    percent?: number;
    total: any;
    focusLabelItems: any;
    timeSeriesSelectorItems: any;
    limitEntriesItems: any;
    setHistoryItem: any;
};

// we should simply add a switch to choose btween day and timeseconds

const Configurator: React.FC<ConfiguratorProps> = ({
    theme = useTheme(),
    focusLabelItems,
    timeSeriesSelectorItems,
    limitEntriesItems,
    setHistoryItem,
}) => {
    // in this way we could set history as first values

    const {
        onTimeSeriesChange,
        onKeyDownTimeSeries,
        onFocusLabeChange,
        onKeyDownFocusLabel,
        onLimitEntriesChange,
        onKeyDownLimitEntries,
        onQueryHistoryChange,
        onFocusHistoryChange,
        onLimitHistoryChange,
        query,
        focus,
        limit,
        totalSeries,
        handleCardinalityRequest,
        reset,
    } = useConfigurator({ setHistoryItem });

    return (
        <div className={cx(ConfigContainerStyles(theme))}>
            <div className="form-row">
                <CardinalityInput
                    name="timeSeriesSelector"
                    value={query}
                    label="Time Series Selector"
                    size="l"
                    inputSize="l"
                    type="text"
                    onChange={onTimeSeriesChange}
                    onKeyDown={onKeyDownTimeSeries}
                    onHistoryChange={onQueryHistoryChange}
                    history={timeSeriesSelectorItems}
                    hasHistory={timeSeriesSelectorItems.length > 0}
                />

                <CardinalityInput
                    name="focusLabel"
                    value={focus}
                    label="Focus Label"
                    size="m"
                    inputSize=""
                    type="text"
                    onChange={onFocusLabeChange}
                    onKeyDown={onKeyDownFocusLabel}
                    onHistoryChange={onFocusHistoryChange}
                    history={focusLabelItems}
                    hasHistory={focusLabelItems.length > 0}
                />

                <CardinalityInput
                    name="limitEntries"
                    value={limit}
                    label="Limit Entries"
                    size="s"
                    inputSize="s"
                    type="number"
                    onChange={onLimitEntriesChange}
                    onKeyDown={onKeyDownLimitEntries}
                    onHistoryChange={onLimitHistoryChange}
                    history={limitEntriesItems}
                    hasHistory={limitEntriesItems.length > 0}
                />
            </div>
            <div className="config-actions">
                <div className="c-totals">
                    <Totals
                        theme={theme}
                        value={totalSeries.amount}
                        text={"total"}
                    />

                    <Totals
                        theme={theme}
                        type={"prev"}
                        value={totalSeries.prev}
                        text={"previous"}
                    />

                    <Totals
                        theme={theme}
                        type={"diff"}
                        value={totalSeries.diff}
                        trend={
                            totalSeries.diff === 0
                                ? "none"
                                : totalSeries.diff > 0
                                ? "up"
                                : "down"
                        }
                        text={"diff"}
                    />
                </div>

                <div className="buttons-group">
                    <DayPicker />
                    <button onClick={reset} className="query-button">
                        Reset
                    </button>
                    <button
                        onClick={handleCardinalityRequest}
                        className="query-button"
                    >
                        <ChevronRightOutlinedIcon fontSize="small" />
                        Execute Query
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Configurator;
