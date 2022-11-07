import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #111;
    width: 100vw;
    min-height: 100vh;
    color: white;
`;

const Container = styled.div`
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    position: relative;
    box-sizing: border-box;

    img {
        margin: -20px;
    }

    @media screen and (max-width: 480px) {
        max-width: none;
    }

    h1 {
        color: #aadad5;
        font-weight: bold;
        margin: 0;
        font-size: 32px;
        text-align: center;
    }

    h3 {
        font-weight: bold;
        margin: 0;
        font-size: 16px;
    }

    & > div {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    input,
    select {
        min-height: 32px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.4);
        font-size: 16px;
        color: white;
        padding: 4px 8px;
    }

    .box {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        padding: 8px;
    }

    button {
        height: 48px;
        width: 100%;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border: none;
        font-size: 16px;
        font-weight: 600;
        transition: all 250ms;
        color: #ccc;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 4px;

        :hover {
            background-color: rgba(255, 255, 255, 0.15);
        }

        :active {
            background-color: rgba(255, 255, 255, 0.2);
        }

        &.chip {
            border-radius: 36px;
            /*
            position: fixed;
            left: 20px;
            top: 20px;*/
            width: auto;
            height: 36px;
            background-color: white;
            color: #bf2828;
            font-weight: bold;
            font-size: 14px;
            padding: 8px 16px;
        }

        &.circle {
            width: 48px;
            height: 48px;
            border-radius: 48px;
        }

        &.highlight {
            background-color: #aadad5;
            color: #000;
        }
    }
`;

interface PageProps {
    children: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
    return (
        <Wrapper>
            <Container>{children}</Container>
        </Wrapper>
    );
};

export default Page;
