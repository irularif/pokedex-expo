import React from "react";
import { Text } from "react-native";
import { renderWithWrapper } from "../../../.ci/testHelper";
import Page from "../Page";
import TopBar from "../TopBar";

describe("Page Component", () => {
  it("should match snapshot", () => {
    const { toJSON } = renderWithWrapper(
      <Page>
        <TopBar>
          <Text>Pokédex</Text>
        </TopBar>
      </Page>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
