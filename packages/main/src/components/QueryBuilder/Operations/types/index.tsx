// Labels extraction from series

export interface LabelSeries {
    labelSeries: string[];
    loading: boolean;
}

export type UseLabelSeriesFn = (
    dataSourceId: string,
    label: string
) => LabelSeries;

export interface SeriesResponse {
    status: string;
    data: Object[];
}

// Operator Builders

// props

interface CommonFormatProps {
    result: string;
    build(initial: string): string;
}

export interface JSONBuilderProps extends CommonFormatProps {
    expressions: string[];
    expressionsString: string;
    setJSON(initial: string): string;
    addExpression(expression: string): void;
    setExpressions(): void;
}

export interface LabelRangeProps {
    result: string;
    range: string;
    labels: string[];
    quantile: string | number;
    labelsString: string;
    setFn(initial: string): void;
    updRange(range: string): void;
    setRange(): void;
    setQuantile(quantile: string | number): void;
    addLabel(label: string): void;
    setLabels(): void;
    build(initial: string): string;
}

export interface RangeBuilderProps {
    result: string;
    range: string;
    setFn(initial: string): void;
    setRange(range: string): void;
    setRate(): void;
    build(initial: string): string;
}

export interface RangeFunctionsBuilderProps {
    result: string;
    range: string;
    quantile: string | number;
    labels: any[];
    labelsString: string;
    setQuantile(quantile: string | number): void;
    setFn(initial: string): void;
    setRange(range: string): void;
    setRate(): void;
    build(initial: string): string;
}

export interface LineFmtBuilderProps {
    result: string;
    expression: string;
    setLine(intial: string): void;
    setText(): void;
    setExpression(expression: string): void;
    build(initial: string): string;
}

export interface PatternFmtBuilderProps {
    result: string;
    expression: string;
    setPattern(intial: string): void;
    setExpression(expression: string): void;
    setText(): void;
    build(initial: string, expression: string): string;
}

export interface RegexFmtBuilderProps {
    result: string;
    expression: string;
    setRegex(intial: string): void;
    setExpression(expression: string): void;
    setText(): void;
    build(initial: string): string;
}

export interface AggregationsBuilderProps {
    result: string;
    labels: any[];
    labelString: string;
    aggrType: AggrType; // this aggregation type sound come from header
    aggrTypeString: string;
    setAggrType(type: AggrType): void;
    setAggrTypeString(): void;
    addLabel(label: string): void;
    setLabels(): void;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface LabelFilterProps {
    result: string;
    label: string;
    operator: string;
    value: string;
    labelValueString: string;
    setLabel(label: string): void;
    setOperator(operator: string): void;
    setValue(value: string): void;
    setFilterType(content: string): string;
    setLabelValueString(): void;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface BinaryOperationProps {
    result: string;
    value: string | number;
    bool: boolean;
    boolString: string;
    setValue(value: string | number): void;
    setBoolean(bool: boolean): void;
    setBooleanString(): void;
    setFn(initial: string): void;
    build(initial: string): string;
}

// we should add the selection type at adding a label

export interface AggregationsBTKBuilderProps {
    result: string;
    labels: any[];
    labelString: string;
    kvalue: number;
    aggrType: AggrType;
    aggrTypeString: string;
    setAggrType(type: AggrType): void;
    setAggrTypeString(): void;
    addLabel(label: string): void;
    setKValue(kvalue: number): void;
    setLabels(): void;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface LineFilterBuilderProps {
    result: string;
    filterText: string;
    lineFilter: string;
    setFilterText(filterText: string): void;
    setFn(initial: string): void;
    closeFn(): void;
    build(initial: string): void;
}

export interface LogFmtBuilderProps extends CommonFormatProps {
    setLogFmt(): string;
}

export interface UnPackBuilderProps extends CommonFormatProps {
    setUnPack(): string;
}
export interface UnwrapBuilderProps extends CommonFormatProps {
    labelValue: string;
    conversion_function: ConversionFn;
    setLabelValue(labelValue: string): void;
    setConversionFn(conversion_function: ConversionFn): void;
    setConversionFnString(): void;
    setUnwrapFmt(): void;
}

export interface TimeFunctionProps extends CommonFormatProps {
    result: string;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface TrigonometricBuilderProps extends CommonFormatProps {
    result: string;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface MetricFunctionBuilderProps extends CommonFormatProps {
    result: string;
    setFn(initial: string): void;
    build(initial: string): string;
}

export interface EditableFunctionBuilderProps extends CommonFormatProps {
    result: string;
    prev_args: string;
    after_args: string;
    setPrevArgs(operation: any): void;
    setAfterArgs(operation: any): void;
    setEditableParams(operation: any): void;
    setFn(initial: string): void;
    build(initial: string): string;
}

// Functions

export type JSONBuilderFn = () => JSONBuilderProps;

export type LabelRangeFn = (rangeType: LabelRangeOperator) => LabelRangeProps;

export type RangeFn = (rangeType: SimpleRangeOperator) => RangeBuilderProps;

export type LineFmtFn = () => LineFmtBuilderProps;

export type PatternFmtFn = () => PatternFmtBuilderProps;

export type RegexFmtFn = () => RegexFmtBuilderProps;

export type UnPackFn = () => UnPackBuilderProps;

export type UnwrapFmtFn = () => UnwrapBuilderProps;

export type LogFmtFn = () => LogFmtBuilderProps;

export type TimeFunctionFn = (timeFunction: TimeFunction) => TimeFunctionProps;

export type LabelFilterFn = (labelFilter: string) => LabelFilterProps;

export type BinaryOperationFn = (
    binaryOperation: BinaryOperation
) => BinaryOperationProps;

export type AggregationsFn = (
    aggregationType: AggregationsOp
) => AggregationsBuilderProps;

export type AggregationsBTKFn = (
    aggregationType: BTKAggregationsOp
) => AggregationsBTKBuilderProps;

export type LineFilterFn = (linefilter: LineFilter) => LineFilterBuilderProps;

export type TrigonometricFn = (
    trigonometricOperation: Trigonometric
) => TrigonometricBuilderProps;

export type RangeFunctionsFn = (
    rangeFunction: RangeFunction
) => RangeFunctionsBuilderProps;

export type MetricFunctionFn = (
    metricFunction: MetricFunction
) => MetricFunctionBuilderProps;
// Range types

export type EditableFuncitonFn = (
    metricFunction: MetricFunction
) => EditableFunctionBuilderProps;
// inject function .... add prev or after args
// manage everything by component
// inject only a string converted
export type SimpleRangeOperator =
    | "rate"
    | "rate_counter"
    | "count_over_time"
    | "sum_over_time"
    | "bytes_rate"
    | "bytes_over_time"
    | "absent_over_time";

export type LabelRangeOperator =
    | "avg_over_time"
    | "min_over_time"
    | "max_over_time"
    | "first_over_time"
    | "last_over_time"
    | "stdvar_over_time"
    | "stddev_over_time"
    | "quantile_over_time";

export type QuantileRangeOperator = "quantile_over_time";

export type AggrType = "by" | "without";

export type AggregationsOp = // normal aggregations

        | "sum"
        | "min"
        | "max"
        | "avg"
        | "stddev"
        | "stdvar"
        | "count"
        | "count_values";

export type BTKAggregationsOp = // topk / bottomk
    "bottomk" | "topk";

export type LineFilter =
    | "line_contains"
    | "line_does_not_contain"
    | "line_contains_regex_match"
    | "line_does_not_match_regex"
    | "line_contains_case_insensitive"
    | "line_does_not_contain_case_insensitive"
    | "ip_line_filter_expression"
    | "ip_line_not_filter_expression";

export type LabelFilter =
    | "label_filter_expression"
    | "ip_label_filter_expression"
    | "no_pipeline_errors";

export type BinaryOperation =
    | "add_scalar"
    | "subtract_scalar"
    | "multiply_by_scalar"
    | "divide_by_scalar"
    | "modulo_by_scalar"
    | "exponent"
    | "equal_to"
    | "not_equal_to"
    | "greater_than"
    | "less_than"
    | "greater_or_equal_to"
    | "less_or_equal_to"
    | "binary_operation_with_query";

export type ConversionFn = "duration" | "duration_seconds" | "bytes" | "";

export type TimeFunction = "day_of_month" | "day_of_week" | "days_in_month";

export type Trigonometric =
    | "acos"
    | "acosh"
    | "asin"
    | "asinh"
    | "atan"
    | "atanh"
    | "cos"
    | "cosh"
    | "sin"
    | "sinh"
    | "tan"
    | "tanh";

export type RangeFunction =
    | "changes"
    | "rate"
    | "irate"
    | "increase"
    | "idelta"
    | "delta"
    | "holt winters"
    | "predict linear"
    | "quantile over time"
    | "deriv"
    | "resets"
    | "sum_over_time"
    | "avg_over_time"
    | "min_over_time"
    | "max_over_time"
    | "count_over_time"
    | "last_over_time"
    | "present_over_time"
    | "absent_over_time"
    | "stddev_over_time";

export type MetricFunction =
    | "histogram_quantile"
    | "label_replace"
    | "ln"
    | "absent"
    | "ceil"
    | "clamp"
    | "clamp_max"
    | "clamp_min"
    | "deg"
    | "exp"
    | "floor"
    | "group"
    | "hour"
    | "label_join"
    | "log10"
    | "log2"
    | "minute"
    | "pi"
    | "quantile"
    | "rad"
    | "round"
    | "scalar"
    | "sgn"
    | "sort"
    | "sort_desc"
    | "sqrt"
    | "stddev"
    | "time"
    | "timestamp"
    | "vector"
    | "year";

export type OperationContainerProps = {
    id: number;
    header: any;
    body: any;
    rate: string;
    removeItem: any;
    index: number;
    opType: string;
    expressions: any[];
    conversion_function: string;
    labelValue: string;
    filterText: string;
    labelFilter: LabelFilter;
    binaryOperation: BinaryOperation;
    lineFilter: string;
    quantile: string | number;
    kValue: number;
    labels: any[];
    labelOpts: string[];
    onExpChange: (expressions: any[]) => void;
    setOperations: any;
};

export interface FilterState {
    label: string;
    operator: string;
    value: string;
}
