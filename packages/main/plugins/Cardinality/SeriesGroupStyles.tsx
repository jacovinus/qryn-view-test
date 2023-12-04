import { cx, css } from "@emotion/css";
import { type QrynTheme } from "@ui/theme/types";

export const getSeriesGroupTheme = (theme: QrynTheme): Partial<QrynTheme> => {
    const {
        neutral,
        primaryLight,
        deep,
        ultraDeep,
        primary,
        contrast,
        shadow,
    } = theme;

    return {
        neutral,
        primaryLight,
        deep,
        ultraDeep,
        primary,
        contrast,
        shadow,
    };
};

export const SeriesGroupContainer = (theme: Partial<QrynTheme>) => css`
    margin: 4px;
    display: flex;
    flex-direction: column;
    padding: 8px 4px;
    background: ${theme.shadow};
    gap: 4px;
    .c-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 14px;
        padding: 8px 6px;
        border-bottom: 1px solid ${theme.neutral};
        font-weight: bold;
    }
    .c-table {
        display: table;
        widht: 100%;
    }
`;

export const useSeriesGroupStyles = (theme: QrynTheme) => {
    return {
        seriesGroupContainer: cx(
            SeriesGroupContainer(getSeriesGroupTheme(theme))
        ),
        seriesGroupStyles: getSeriesGroupTheme(theme),
    };
};
