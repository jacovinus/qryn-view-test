import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import HistoryIcon from "@mui/icons-material/History";
import { BtnSmall } from "@ui/theme/styles/Button";
import { InputSmall } from "@ui/theme/styles/Input";
import { css } from "@emotion/css";

export const HistoryIconStyled: any = styled(HistoryIcon)`
    height: 18px;
    color: ${({ color }) => color};
    width: 18px;
`;
export const HistoryButtonStyled: any = styled(BtnSmall)`
    background: none;
    margin-left: 5px;
    color: ${(props: any) => props.theme.contrast};
    background: ${(props: any) => props.theme.neutral};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    height: 28px;
    span {
        margin-left: 5px;
    }
    @media screen and (max-width: 1070px) {
        display: flex;
    }
`;

export const ShowLabelsBtn: any = styled(BtnSmall)`
    background: ${(props: any) => props.theme.neutral};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    text-overflow: ellipsis;
    transition: 0.25s all;
    padding-left: 6px;
    justify-content: flex-start;
    color: ${({ theme }: any) => theme.contrast};
    height: 28px;
    &:hover {
        background: ${({ theme }: any) => theme.lightNeutral};
    }
    @media screen and (max-width: 1070px) {
        display: ${({ isMobile }: { isMobile: boolean }) =>
            isMobile ? "flex" : "none"};

        margin: 0;
    }
`;

export const QueryBarContainer: any = styled.div`
    display: flex;
    padding: 0px 4px;
    margin-left: 0px;
    flex-wrap: wrap;
    border-radius: 3px;
`;
export const ShowLogsBtn: any = styled(BtnSmall, {
    shouldForwardProp: (prop) => isPropValid(prop) && prop !== "loading",
})`
    background: ${(props: any) =>
        props.loading ? "#44bcd8" : props.theme.primary};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    color: ${(props: any) => props.theme.maxContrast};
    margin-left: 5px;
    transition: 0.25s all;
    justify-content: center;
    padding: 3px 12px;

    height: 28px;
    &:hover {
        background: ${(props: any) => props.theme.primaryLight};
    }
    &:disabled {
        background: ${(props: any) => props.theme.neutral};
        border: 1px solid ${(props: any) => props.theme.accentNeutral};
        cursor: not-allowed;
        color: ${(props: any) => props.theme.contrast};
    }
    @media screen and (max-width: 1070px) {
        display: flex;

        margin: 0;
        margin-left: 5px;
    }
`;

export const ShowSettingsBtn: any = styled(BtnSmall)`
    background: none;
    margin-left: 5px;
    color: ${(props: any) => props.theme.contrast};
    background: ${(props: any) => props.theme.neutral};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    height: 28px;
    span {
        margin-left: 5px;
    }
    display: ${(props: any) =>
        props.isMobile || props.isSplit ? "flex" : "none"};
`;

export const MobileTopQueryMenu: any = styled.div`
    display: flex;
    flex-wrap: wrap;

    @media screen and (max-width: 1070px) {
        display: flex;
    }
`;

export const InputGroup: any = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-right: 10px;
`;
export const InlineGroup: any = styled.div`
    display: flex;
    align-items: center;
`;

export const SettingCont: any = styled.div<{ theme: any }>`
    display: flex;
    flex: 1;
    flex-direction: column;

    background: ${({ theme }) => theme.shadow};
`;

export const SettingsInputContainer: any = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .options-input {
        margin: 10px;
        display: flex;
        justify-content: space-between;
    }
`;

export const SettingInput: any = styled(InputSmall)`
    background: ${({ theme }: any) => theme.deep};
    margin: 5px;
    flex: 1;
    padding: 5px 12px;
    border: 1px solid ${({ theme }: any) => theme.accentNeutral};
    color: ${({ theme }: any) => theme.contrast};
    &:focus {
        border: 1px solid ${({ theme }: any) => theme.lightNeutral};
    }
`;
export const SettingButton: any = styled(BtnSmall)`
    background: ${({ theme }: any) => theme.primary};
    color: ${({ theme }: any) => theme.maxContrast};
    height: 30px;
    &:hover {
        background: ${({ theme }: any) => theme.primaryLight};
    }
`;

export const SettingLabel = styled.label`
    font-size: 11px;
    white-space: nowrap;
    color: ${({ theme }: any) => theme.contrast};
    margin-left: 10px;
`;

export const SettingHeader: any = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    h3 {
        margin-left: 10px;
        font-size: 1em;
        color: ${({ theme }: any) => theme.contrast};
    }
`;
export const SettingCloseBtn: any = styled(BtnSmall)`
    background: none;
    padding: 0;
    color: ${({ theme }: any) => theme.contrast};
`;

export const Label = styled.div`
    color: ${({theme}: any) => theme.contrast};
    background: ${({theme}: any) => theme.shadow};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 0px 8px;
`;

export const ResSelect = styled.select`
    cursor: pointer;
    position: relative;
    font-size: 14px;
    color: ${({theme}: any) => theme.contrast};
    background: ${({theme}: any) => theme.deep};
    border: 1px solid ${({theme}: any) => theme.accentNeutral};
    border-radius: 3px;
    padding: 4px 8px;
    line-height: 20px;
    flex: 1;
    max-width: 70px;
    &::-webkit-scrollbar {
        width: 5px;
        background: ${({theme}: any) => theme.deep};
    }
    &::-webkit-scrollbar-corner {
        background: transparent;
      }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: ${({theme}: any) => theme.alphaPlusNeutral};
    }
`;


export const QLInputGroup = styled.div`
    display: flex;
    margin-right: 10px;
`;

export const QLLabel = styled.div`
    color: ${(props: any) => props.theme.contrast};
    background: ${(props: any) => props.theme.shadow};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    white-space: nowrap;
    padding: 0px 10px;
`;

export const Input = styled.input`
    flex: 1;
    background: ${(props: any) => props.theme.deep};
    color: ${(props: any) => props.theme.contrast};
    border: 1px solid ${(props: any) => props.theme.accentNeutral};
    border-radius: 3px;
    max-width: 60px;
    padding-left: 8px;
`;

export const QueryTypeCont = styled.div`
    display: flex;
    padding: 4px 0px;
    color: ${(props: any) => props.color};
    height: 26px;
`;


export const maxWidth = css`
    max-width: 100%;
`;


