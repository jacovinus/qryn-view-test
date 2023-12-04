import { ThemeProvider } from "@emotion/react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PluginRenderer from "@ui/plugins/PluginsRenderer";
import { DataViewItem } from "./components/DataViewItem";
import useTheme from "@ui/theme/useTheme";
import { DataviewsContainer } from "./styled";

export default function DataViews(props: any) {
    const { name, open } = props;
    const theme = useTheme();
    const isCardinality = useSelector((store: any) => store.isCardinality);

    const [side] = useState(name);
    const dataViews = useSelector((store: any) => store[`${side}DataView`]);
    const queries = useSelector((store: any) => store[side]);
    const viewsMemo = useMemo(() => {
        return dataViews.sort((a: any, b: any) => {
            return (
                queries.findIndex((query: any) => query.id === a.id) -
                queries.findIndex((query: any) => query.id === b.id)
            );
        });
    }, [dataViews, queries]);
    if (viewsMemo.length > 0) {
        return (
            <ThemeProvider theme={theme}>
                <DataviewsContainer>
                    <PluginRenderer section={"Data Views"} localProps={props} />
                    {!isCardinality && viewsMemo?.map((dv: any, index: any) => (
                        <DataViewItem
                            key={index}
                            {...props}
                            splitted={open}
                            dataView={dv}
                        />
                    ))}
                </DataviewsContainer>
            </ThemeProvider>
        );
    }

    return null;
}
