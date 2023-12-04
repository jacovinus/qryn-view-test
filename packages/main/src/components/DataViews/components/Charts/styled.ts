import styled from "@emotion/styled";
/**
 * Labels styles
 */
export const LabelsContainer: any = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 60px;
  overflow-y: auto;
  margin: 5px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: ${({theme}: any) => theme.alphaPlusNeutral};
  }
`;

export const ChartLabel: any = styled.div`
  font-size: 12px;
  color: ${({theme}: any) => theme.contrast};
  font-family: sans-serif;
  display: flex;
  align-items: center;
  line-height: 1.5;
  padding-right: 10px;
  cursor: pointer;
  opacity: ${(props: any) => props.isVisible ? "1" : ".5"};
  border-radius: 3px;
  &:hover {
    background: ${({theme}: any) => theme.lightNeutral};
  }
`;

export const ColorLabel: any = styled.div`
  height: 4px;
  width: 16px;
  margin-right: 8px;
  background: ${(props: any) => props.color};
  content: " ";
`;

/**
 *  Chart Tools styles
 */
export const ChartButton: any = styled.button`
  background: ${(props: any) => props.isActive ? props.theme.neutral : props.theme.lightNeutral};
  color: ${({theme}: any) => theme.contrast};
  padding: 3px 12px;
  border: 1px solid ${({theme}: any) => theme.accentNeutral};
  border-radius: ${(props: any) => props.rightBtn
      ? "0px 3px 3px 0px"
      : props.leftBtn
      ? "3px 0px 0px 3px"
      : "none"};
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  flex: 1;
`;

export const ChartToolsCont: any = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${(props: any) => props.isMobile ? "column" : "row"};

  margin: 10px 25px;
  justify-content: space-between;
  .limit-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    margin-bottom: ${(props: any) => props.isMobile ? "10px" : "0px"};
    width: ${(props: any) => props.isMobile ? "100%" : "auto"};
    div {
      flex: ${(props: any) => props.isMobile ? "1" : "0"};
      text-align: ${(props: any) => props.isMobile ? "center" : "left"};
    }
  }
  .chart-buttons-cont {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: ${(props: any) => props.isMobile ? "1" : "0"};
    width: ${(props: any) => props.isMobile ? "100%" : "auto"};
  }
`;

/**
 * Show Series styles
 */

export const ShowSeries: any = styled.div`
  font-size: 12px;
  line-height: 20px;
  padding: 3px 12px;
  white-space: nowrap;
  color: ${({theme}: any) => theme.contrast};
  background: ${({theme}: any) => theme.neutral};
  border: 1px solid ${({theme}: any) => theme.accentNeutral};
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s all;
  &:hover {
    background: ${({theme}: any) => theme.lightNeutral};
  }
`;

export const ChartCont: any = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${({ theme }: any) => theme.ultraDeep};
  .chart-cont {
    flex: 1;
  }
`;
