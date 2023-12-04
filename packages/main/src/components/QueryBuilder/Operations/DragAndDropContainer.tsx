import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import update from "immutability-helper";
import type { FC } from "react";
import { useCallback } from "react";
import { Operations } from "./Operations";
import { css, cx } from "@emotion/css";

// Drag and Drop container for the operation function for query builder

export const OperationsContainerStyles = css`
    width: 100%;
    display: flex;
    flex-wrap:wrap;
`;

export interface LabelFilter {
    label:string;
    operator:string;
    value:string;
}

export interface BinaryOperation {
    value: string | number;
    bool:boolean;
}
export interface Item {
    id: number;
    header: any;
    body: any;
    expressions: any[];
    filterText:string;
    conversion_function: string,
    labelValue: string,
    labelFilter: LabelFilter;
    binaryOperation: BinaryOperation;
    lineFilter:string;
    quantile:string|number
    kValue:number;
    labels: any[];
    labelOpts:string[];
    opType: string;
}

export interface ContainerState {
    operations: Item[];
}

export type OperationsContainerProps = {
    addBinary(index:number):void
    operations: any[];
    setOperations: (operations: any) => void;
};

// OPERATIONS CONTAINER

export const OperationsContainer: FC<OperationsContainerProps> = (props: any) => {
    const { operations, setOperations } = props;
    const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
        setOperations((prevCards: Item[]) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex] as Item],
                ],
            })
        );
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeItem = useCallback((dragIndex: number) => {
        setOperations((prevCards: Item[]) =>
            update(prevCards, { $splice: [[dragIndex, 1]] })
        );
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCard = useCallback((operation: Item, index: number) => {
        return (
            <Operations
                {...props}
                key={operation.id}
                index={index}
                id={operation.id}
                opType={operation.opType}
                header={operation.header}
                kValue={operation.kValue}
                quantile={operation.quantile}
                labelValue={operation.labelValue}
                conversion_function={operation.conversion_function}
                binaryOperation={operation.binaryOperation}
                labelOpts={operation.labelOpts}
                lineFilter={operation.lineFilter}
                body={operation.body || <></>}
                moveItem={moveItem}
                removeItem={removeItem}
            />
        );
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
        <div className={cx(OperationsContainerStyles)}>
            {operations.map((operation: any, i: number) =>
                renderCard(operation, i)
            )}
        </div>
        </DndProvider>
    );
};

// Drag and drop base provider

