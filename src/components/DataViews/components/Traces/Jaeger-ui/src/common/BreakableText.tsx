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

import { css } from '@emotion/css';
import * as React from 'react';

const BreakableTextStyle = css`
       display: inline-block;
       white-space: pre;
     `


const WORD_RX = /\W*\w+\W*/g;

type Props = {
  text: string;
  className?: string;
  wordRegexp?: RegExp;
};

// TODO typescript doesn't understand text or null as react nodes
// https://github.com/Microsoft/TypeScript/issues/21699
export default function BreakableText(
  props: Props
): any /* React.ReactNode /* React.ReactElement | React.ReactElement[] \*\/ */ {
  const { className, text, wordRegexp = WORD_RX } = props;
//   const styles = useStyles2(getStyles);
  if (!text) {
    return typeof text === 'string' ? text : null;
  }
  const spans = [];
  wordRegexp.exec('');
  // if the given text has no words, set the first match to the entire text
  let match: RegExpExecArray | string[] | null = wordRegexp.exec(text) || [text];
  while (match) {
    spans.push(
      <span key={`${text}-${spans.length}`} className={className || BreakableTextStyle}>
        {match[0]}
      </span>
    );
    match = wordRegexp.exec(text);
  }
  return spans;
}

BreakableText.defaultProps = {
  wordRegexp: WORD_RX,
};
