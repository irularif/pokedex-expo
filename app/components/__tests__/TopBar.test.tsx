import React from "react";
import { Text } from "react-native";
import { renderWithWrapper } from "../../../.ci/testHelper";
import TopBar from "../TopBar";

describe("TopBar Component", () => {
  it("should match snapshot", () => {
    const { toJSON } = renderWithWrapper(
      <TopBar>
        <Text>Pokédex</Text>
      </TopBar>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
