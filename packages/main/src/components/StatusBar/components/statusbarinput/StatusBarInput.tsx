import { useDispatch } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import useTheme from "@ui/theme/useTheme"
import sanitizeWithSigns from "@ui/helpers/sanitizeWithSigns";



export function StatusBarInput(props: any) {
    const theme = useTheme();
    const { label, value, dispatchAction, type } = props;
    const dispatch: any = useDispatch();
    const handleStatusInputChange = (e: any) => {
        dispatch(dispatchAction(e.target.value));
    };
    return (
        <ThemeProvider theme={theme}>
            <div className="selector">
                <span className="label">{label}</span>
                <input
                    className={type}
                    value={sanitizeWithSigns(value)}
                    onChange={handleStatusInputChange}
                />
            </div>
        </ThemeProvider>
    );
}
