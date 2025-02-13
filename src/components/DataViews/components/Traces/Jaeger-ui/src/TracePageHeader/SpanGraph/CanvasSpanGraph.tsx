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

import * as React from "react";

import { TNil } from "../../types";
import { getRgbColorByKey } from "../../utils/color-generator";

import renderIntoCanvas from "./render-into-canvas";
import styled from "@emotion/styled";

const StyledCanvas = styled.canvas<{ theme: any }>`
    // background: ${({theme}: any) => theme.logBgColor};
    //background:red !important;
    height: 60px;
    position: absolute;
    width: 100%;
`;
type CanvasSpanGraphProps = {
    items: Array<{
        valueWidth: number;
        valueOffset: number;
        serviceName: string;
    }>;
    valueWidth: number;
    theme: any;
};

export class UnthemedCanvasSpanGraph extends React.PureComponent<CanvasSpanGraphProps> {
    _canvasElm: HTMLCanvasElement | TNil;
    theme: any;
    constructor(props: CanvasSpanGraphProps) {
        super(props);
        this._canvasElm = undefined;
    }
    getColor = (key: string) => getRgbColorByKey(key, this.props.theme);

    componentDidMount() {
        this._draw();
    }

    componentDidUpdate() {
        this._draw();
    }

    _setCanvasRef = (elm: HTMLCanvasElement | TNil) => {
        this._canvasElm = elm;
    };

    _draw() {
        if (this._canvasElm) {
            const { valueWidth: totalValueWidth, items } = this.props;
            renderIntoCanvas(
                this._canvasElm,
                items,
                totalValueWidth,
                this.getColor,
                this.props.theme.logBgColor //autoColor(this.props.theme)
            );
        }
    }

    render() {
        return (
            <StyledCanvas theme={this.props.theme} ref={this._setCanvasRef} />
        );
    }
}

export default /* withTheme2( */ UnthemedCanvasSpanGraph /* ) */;
