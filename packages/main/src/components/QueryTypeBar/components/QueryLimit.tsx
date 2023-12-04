import styled from "@emotion/styled";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRightPanel } from "@ui/store/actions/setRightPanel";
import { setLeftPanel } from "@ui/store/actions/setLeftPanel";
import { Tooltip } from "@mui/material";

const InputGroup = styled.div`
    display: flex;
    margin-right: 10px;
`;

const Label = styled.div`
    color: ${(props: any) => props.theme.contrast};
    background: ${(props: any) => props.theme.shadow};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    white-space: nowrap;
    padding: 0px 10px;
`;

const Input = styled.input`
    flex: 1;
    background: ${(props: any) => props.theme.deep};
    color: ${(props: any) => props.theme.contrast};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    border-radius: 3px;
    max-width: 60px;
    padding-left: 8px;
`;

export function panelAction(name: any, value: any) {
    if (name === "left") {
        return setLeftPanel(value);
    }
    return setRightPanel(value);
}

export default function QueryLimit(props: any) {
    const dispatch: any = useDispatch();
    const { id }: any = props.data;
    const { name }: any = props;
    const panelQuery = useSelector((store: any) => store[name]);
    const [editedValue, setEditedValue] = useState(props.data.limit);
    const limitFromProps = useMemo(() => props.data.limit, [props.data.limit]);

    useEffect(() => {
        setEditedValue(limitFromProps);
    }, [limitFromProps, setEditedValue]);

    function onLimitChange(e: any) {
        let limitTxt = e.target.value;
        if(limitTxt > 20000) {
            limitTxt = 20000
        }
        const panel = [...panelQuery];

        panel.forEach((query) => {
            if (query.id === id) {
                query.limit = limitTxt;
            }
        });

        dispatch(panelAction(name, panel));
    }

    return (
        <InputGroup>
       
            <Label>Query Limit</Label>
            <Tooltip title="max 20000">
            <Input
                type={"number"}
                value={editedValue}
                onChange={onLimitChange}
            />
            </Tooltip>
        </InputGroup>
    );
}
