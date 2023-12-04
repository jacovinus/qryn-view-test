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

import styled from "@emotion/styled";
import React from "react";


import { formatDuration } from "../../utils/date";
const TickLabelsStyled = styled.div`
    height: 1.25rem;
    position: relative;
    display:flex;
    align-items:center;
`;
const TickLabelsLabel = styled.div<{theme:any}>`
    color: ${({theme})=>theme.contrast};
    font-size: 0.75rem;
    position: absolute;
    user-select: none;
`;
/* const getStyles = () => {
  return {
    ,
    ,
  };
}; */

type TickLabelsProps = {
    theme:any;
    numTicks: number;
    duration: number;
};

export default function TickLabels(props: TickLabelsProps) {
    const { numTicks, duration } = props;

    const ticks = [];
    for (let i = 0; i < numTicks + 1; i++) {
        const portion = i / numTicks;
        const style =
            portion === 1 ? { right: "0%" } : { left: `${portion * 100}%` };
        ticks.push(
            <TickLabelsLabel theme={props.theme} key={portion} style={style} data-testid="tick">
                {formatDuration(duration * portion)}
            </TickLabelsLabel>
        );
    }

    return <TickLabelsStyled>{ticks}</TickLabelsStyled>;
}
