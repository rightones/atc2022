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

    box-sizing: border-box;

    @media screen and (max-width: 480px) {
        max-width: none;
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

    button {
        height: 48px;
        width: 100%;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        font-size: 16px;
        font-weight: bold;
        transition: all 250ms;

        :hover {
            background-color: rgba(255, 255, 255, 0.7);
        }

        :active {
            background-color: rgba(255, 255, 255, 0.6);
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
